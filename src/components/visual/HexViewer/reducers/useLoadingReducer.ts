import { useCallback, useMemo } from 'react';
import { isAction, ReducerHandler, Reducers, UseReducer } from '..';

export type LoadingState = {
  loading: {
    progress: number;
    isInvalidData: boolean;
    refsReady: boolean;
    hasResized: boolean;
    hasScrolled: boolean;
    hasLoadedSettings: boolean;
    initialized: boolean;
    error: boolean;
    message: string;
  };
};

export const useLoadingReducer: UseReducer<LoadingState> = () => {
  const initialState = useMemo<LoadingState>(
    () => ({
      loading: {
        progress: 0,
        isInvalidData: false,
        refsReady: false,
        hasResized: false,
        hasScrolled: false,
        hasLoadedSettings: false,
        initialized: false,
        error: false,
        message: 'loading.initialization'
      }
    }),
    []
  );

  const bodyInit: Reducers['bodyInit'] = useCallback((store, { initialized }) => {
    if (initialized)
      return {
        ...store,
        loading: {
          ...store.loading,
          progress: 100,
          isInvalidData: false,
          refsReady: true,
          hasResized: true,
          hasScrolled: true,
          hasLoadedSettings: true,
          initialized: true,
          error: false,
          message: ''
        }
      };
    else
      return {
        ...store,
        loading: {
          ...store.loading,
          isInvalidData: false,
          refsReady: false,
          hasResized: false,
          hasScrolled: false,
          hasLoadedSettings: false,
          initialized: false,
          error: false,
          message: 'loading.bodyInit',
          progress: (100 * 2) / 8
        }
      };
  }, []);

  const appLoad: Reducers['appLoad'] = useCallback((store, { data }) => {
    return {
      ...store,
      loading: { ...store.loading, message: 'loading.appLoad', progress: (100 * 1) / 8 }
    };
  }, []);

  const settingLoad: Reducers['settingLoad'] = useCallback((store, payload) => {
    return {
      ...store,
      loading: {
        ...store.loading,
        hasLoadedSettings: true,
        message: 'loading.settingLoad',
        progress: (100 * 2) / 8
      }
    };
  }, []);

  const appLocationInit: Reducers['appLocationInit'] = useCallback((store, payload) => {
    return {
      ...store,
      loading: { ...store.loading, message: 'loading.appLocationInit', progress: (100 * 3) / 8 }
    };
  }, []);

  const bodyRefInit: Reducers['bodyRefInit'] = useCallback((store, { ready }) => {
    return {
      ...store,
      loading: {
        ...store.loading,
        refsReady: ready,
        message: 'loading.bodyRefInit',
        progress: (100 * 5) / 8
      }
    };
  }, []);

  const bodyResize: Reducers['bodyResize'] = useCallback((store, payload) => {
    return {
      ...store,
      loading: {
        ...store.loading,
        hasResized: true,
        message: 'loading.bodyResize',
        progress: (100 * 6) / 8
      }
    };
  }, []);

  const bodyScrollInit: Reducers['bodyScrollInit'] = useCallback((store, payload) => {
    return {
      ...store,
      loading: {
        ...store.loading,
        initialized: true,
        hasScrolled: true,
        message: 'loading.bodyScrollInit',
        progress: (100 * 7) / 8
      }
    };
  }, []);

  const bodyItemsRendered: Reducers['bodyItemsRendered'] = useCallback((store, payload) => {
    if (!store.loading.hasScrolled)
      return { ...store, loading: { ...store.loading, message: 'loading.bodyItemsRendered', progress: (100 * 4) / 8 } };
    else
      return {
        ...store,
        loading: { ...store.loading, message: 'loading.initialized', progress: 100 }
      };
  }, []);

  const reducer: ReducerHandler = useCallback(
    ({ store, action: { type, payload } }) => {
      if (isAction.appLoad(type)) return appLoad(store, payload);
      else if (isAction.settingLoad(type)) return settingLoad(store, payload);
      else if (isAction.appLocationInit(type)) return appLocationInit(store, payload);
      else if (isAction.bodyInit(type)) return bodyInit(store, payload);
      else if (isAction.bodyRefInit(type)) return bodyRefInit(store, payload);
      else if (isAction.bodyScrollInit(type)) return bodyScrollInit(store, payload);
      else if (isAction.bodyResize(type)) return bodyResize(store, payload);
      else if (isAction.bodyItemsRendered(type)) return bodyItemsRendered(store, payload);
      else return { ...store };
    },
    [appLoad, appLocationInit, bodyInit, bodyItemsRendered, bodyRefInit, bodyResize, bodyScrollInit, settingLoad]
  );

  return { initialState, reducer };
};
