import { Grid, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import makeStyles from '@mui/styles/makeStyles';
import useAppUser from 'commons/components/app/hooks/useAppUser';
import PageFullWidth from 'commons/components/pages/PageFullWidth';
import PageHeader from 'commons/components/pages/PageHeader';
import useDrawer from 'components/hooks/useDrawer';
import useMyAPI from 'components/hooks/useMyAPI';
import { CustomUser } from 'components/hooks/useMyUser';
import { ChipList } from 'components/visual/ChipList';
import Histogram from 'components/visual/Histogram';
import LineGraph from 'components/visual/LineGraph';
import SearchBar from 'components/visual/SearchBar/search-bar';
import { DEFAULT_SUGGESTION } from 'components/visual/SearchBar/search-textfield';
import SimpleSearchQuery from 'components/visual/SearchBar/simple-search-query';
import SearchPager from 'components/visual/SearchPager';
import ArchivesTable from 'components/visual/SearchResult/archives';
import SearchResultCount from 'components/visual/SearchResultCount';
import { safeFieldValue } from 'helpers/utils';
import 'moment/locale/fr';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import ErrorDetail from './admin/error_detail';

const PAGE_SIZE = 25;

const useStyles = makeStyles(theme => ({
  searchresult: {
    fontStyle: 'italic',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  drawerPaper: {
    width: '80%',
    maxWidth: '800px',
    [theme.breakpoints.down('xl')]: {
      width: '100%'
    }
  }
}));

type ErrorResults = {
  items: any[];
  offset: number;
  rows: number;
  total: number;
};

type FileInfo = {
  archive_ts: string;
  ascii: string;
  classification: string;
  entropy: number;
  expiry_ts: string | null;
  hex: string;
  id: string;
  magic: string;
  md5: string;
  mime: string;
  seen: {
    count: number;
    first: string;
    last: string;
  };
  sha1: string;
  sha256: string;
  size: number;
  ssdeep: string;
  tags: string[];
  type: string;
};

type FileResults = {
  items: FileInfo[];
  offset: number;
  rows: number;
  total: number;
};

const DEFAULT_TC = '4d';

const TC_MAP = {
  '24h': 'created:[now-24h TO now]',
  '4d': 'created:[now-4d TO now]',
  '7d': 'created:[now-7d TO now]',
  '1m': 'created:[now-1M TO now]'
};

const START_MAP = {
  '24h': 'now-1d',
  '4d': 'now-4d',
  '7d': 'now-7d',
  '1m': 'now-1M',
  '1y': 'now-1y'
};

const GAP_MAP = {
  '24h': '1h',
  '4d': '2h',
  '7d': '4h',
  '1m': '1d',
  '1y': '15d'
};

export default function MalwareArchive() {
  const { t } = useTranslation(['archive']);
  const theme = useTheme();
  const classes = useStyles();
  const location = useLocation();
  const upMD = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();
  const { apiCall } = useMyAPI();
  const { user: currentUser } = useAppUser<CustomUser>();
  const { closeGlobalDrawer, setGlobalDrawer, globalDrawerOpened } = useDrawer();

  const [fileResults, setFileResults] = useState<FileResults>(null);
  const [errorResults, setErrorResults] = useState<ErrorResults>(null);
  const [query, setQuery] = useState<SimpleSearchQuery>(null);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTION);
  const [histogram, setHistogram] = useState(null);
  const [types, setTypes] = useState(null);
  const [names, setNames] = useState(null);
  const [pageSize] = useState<number>(PAGE_SIZE);
  const [searching, setSearching] = useState<boolean>(false);

  const filterValue = useRef<string>('');
  const queryValue = useRef<string>('');

  const onClear = useCallback(
    () => {
      if (query.getAll('filters').length !== 0) {
        query.delete('query');
        navigate(`${location.pathname}?${query.getDeltaString()}`);
      } else {
        navigate(location.pathname);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, query]
  );

  const onSearch = useCallback(
    () => {
      if (filterValue.current !== '') {
        query.set('query', filterValue.current);
        navigate(`${location.pathname}?${query.getDeltaString()}`);
      } else {
        onClear();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, location.pathname, onClear]
  );

  const onFilterValueChange = useCallback((inputValue: string) => {
    filterValue.current = inputValue;
  }, []);

  const setErrorKey = useCallback(
    (error_key: string) => {
      navigate(`${location.pathname}${location.search ? location.search : ''}#${error_key}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search]
  );

  useEffect(() => {
    setQuery(new SimpleSearchQuery(location.search, `rows=${pageSize}&offset=0&tc=${DEFAULT_TC}`));
  }, [location.pathname, location.search, pageSize]);

  useEffect(() => {
    if (errorResults !== null && !globalDrawerOpened && location.hash) {
      navigate(`${location.pathname}${location.search ? location.search : ''}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalDrawerOpened]);

  useEffect(() => {
    if (location.hash) {
      setGlobalDrawer(<ErrorDetail error_key={location.hash.substr(1)} />);
    } else {
      closeGlobalDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  useEffect(() => {
    if (query && currentUser.is_admin) {
      const curQuery = new SimpleSearchQuery(query.toString(), `rows=${pageSize}&offset=0`);
      const tc = curQuery.pop('tc') || DEFAULT_TC;
      curQuery.set('rows', pageSize);
      curQuery.set('offset', 0);
      if (tc !== '1y') {
        curQuery.add('filters', TC_MAP[tc]);
      }
      setSearching(true);
      apiCall({
        url: `/api/v4/error/list/?${curQuery.toString()}`,
        onSuccess: api_data => {
          setErrorResults(api_data.api_response);
        },
        onFinalize: () => {
          setSearching(false);
        }
      });
      apiCall({
        url: `/api/v4/search/facet/error/response.service_name/?${curQuery.toString([
          'rows',
          'offset',
          'sort',
          'track_total_hits'
        ])}`,
        onSuccess: api_data => {
          setNames(api_data.api_response);
        }
      });
      apiCall({
        url: `/api/v4/search/facet/error/type/?${curQuery.toString(['rows', 'offset', 'sort', 'track_total_hits'])}`,
        onSuccess: api_data => {
          setTypes(api_data.api_response);
        }
      });
      apiCall({
        url: `/api/v4/search/histogram/error/created/?start=${START_MAP[tc]}&end=now&gap=${
          GAP_MAP[tc]
        }&mincount=0&${curQuery.toString(['rows', 'offset', 'sort', 'track_total_hits'])}`,
        onSuccess: api_data => {
          setHistogram(api_data.api_response);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    apiCall({
      url: '/api/v4/search/fields/file/',
      onSuccess: api_data => {
        setSuggestions([
          ...Object.keys(api_data.api_response).filter(name => api_data.api_response[name].indexed),
          ...DEFAULT_SUGGESTION
        ]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(query);
    if (query) {
      queryValue.current = query.get('query', '');
      if (query.get('query')) {
        console.log(query.getParams());

        apiCall({
          method: 'POST',
          url: `/api/v4/search/file/`,
          body: { ...query.getParams(), rows: pageSize, offset: 0 },
          onSuccess: api_data => {
            console.log(api_data);
            setFileResults(api_data.api_response);
          },
          onFailure: api_data => {
            // if (index || id || !api_data.api_error_message.includes('Rewrite first')) {
            //   showErrorMessage(api_data.api_error_message);
            // } else {
            //   stateMap[searchIndex]({ total: 0, offset: 0, items: [], rows: pageSize });
            // }
          },
          onFinalize: () => {
            // if (index || id) {
            //   setSearching(false);
            // }
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [query]);

  return currentUser.is_admin ? (
    <PageFullWidth margin={4}>
      <Grid container spacing={2} style={{ paddingBottom: theme.spacing(2) }}>
        <Grid item xs={12} sm={7} md={9} xl={10}>
          <Typography variant="h4">{t('title')}</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={3} xl={2}>
          <FormControl size="small" fullWidth>
            <Select
              disabled={searching}
              value={query ? query.get('tc') || DEFAULT_TC : DEFAULT_TC}
              variant="outlined"
              onChange={event => {
                query.set('tc', event.target.value);
                navigate(`${location.pathname}?${query.getDeltaString()}`);
              }}
              fullWidth
            >
              <MenuItem value="24h">{t('tc.24h')}</MenuItem>
              <MenuItem value="4d">{t('tc.4d')}</MenuItem>
              <MenuItem value="7d">{t('tc.7d')}</MenuItem>
              <MenuItem value="1m">{t('tc.1m')}</MenuItem>
              <MenuItem value="1y">{t('tc.1y')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <PageHeader isSticky>
        <div style={{ paddingTop: theme.spacing(1) }}>
          <SearchBar
            initValue={query ? query.get('query', '') : ''}
            placeholder={t('filter')}
            searching={searching}
            suggestions={suggestions}
            onValueChange={onFilterValueChange}
            onClear={onClear}
            onSearch={onSearch}
          >
            {errorResults !== null && (
              <div className={classes.searchresult}>
                {errorResults.total !== 0 && (
                  <Typography variant="subtitle1" color="secondary" style={{ flexGrow: 1 }}>
                    {searching ? (
                      <span>{t('searching')}</span>
                    ) : (
                      <span>
                        <SearchResultCount count={errorResults.total} />
                        {query.get('query')
                          ? t(`filtered${errorResults.total === 1 ? '' : 's'}`)
                          : t(`total${errorResults.total === 1 ? '' : 's'}`)}
                      </span>
                    )}
                  </Typography>
                )}

                <SearchPager
                  method="GET"
                  url="/api/v4/error/list/"
                  total={errorResults.total}
                  setResults={setErrorResults}
                  pageSize={pageSize}
                  index="user"
                  query={query}
                  setSearching={setSearching}
                />
              </div>
            )}

            {query && (
              <div>
                <ChipList
                  items={query.getAll('filters', []).map(v => ({
                    variant: 'outlined',
                    label: `${v}`,
                    color: v.indexOf('NOT ') === 0 ? 'error' : null,
                    onClick: () => {
                      query.replace(
                        'filters',
                        v,
                        v.indexOf('NOT ') === 0 ? v.substring(5, v.length - 1) : `NOT (${v})`
                      );
                      navigate(`${location.pathname}?${query.getDeltaString()}`);
                    },
                    onDelete: () => {
                      query.remove('filters', v);
                      navigate(`${location.pathname}?${query.getDeltaString()}`);
                    }
                  }))}
                />
              </div>
            )}
          </SearchBar>
        </div>
      </PageHeader>

      {errorResults !== null && errorResults.total !== 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Histogram
              dataset={histogram}
              height="200px"
              title={t(`graph.histogram.title.${query ? query.get('tc') || DEFAULT_TC : DEFAULT_TC}`)}
              datatype={t('graph.datatype')}
              isDate
              verticalLine
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LineGraph
              dataset={names}
              height="200px"
              title={t('graph.name.title')}
              datatype={t('graph.datatype')}
              onClick={(evt, element) => {
                if (!searching && element.length > 0) {
                  var ind = element[0].index;
                  query.add('filters', `response.service_name:${Object.keys(names)[ind]}`);
                  navigate(`${location.pathname}?${query.getDeltaString()}`);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LineGraph
              dataset={types}
              height="200px"
              title={t('graph.type.title')}
              datatype={t('graph.datatype')}
              onClick={(evt, element) => {
                if (!searching && element.length > 0) {
                  var ind = element[0].index;
                  query.add('filters', `type:${safeFieldValue(Object.keys(types)[ind])}`);
                  navigate(`${location.pathname}?${query.getDeltaString()}`);
                }
              }}
            />
          </Grid>
        </Grid>
      )}

      <div style={{ paddingTop: theme.spacing(2), paddingLeft: theme.spacing(0.5), paddingRight: theme.spacing(0.5) }}>
        <ArchivesTable fileResults={fileResults} setErrorKey={setErrorKey} />
      </div>
    </PageFullWidth>
  ) : (
    <Navigate to="/forbidden" replace />
  );
}