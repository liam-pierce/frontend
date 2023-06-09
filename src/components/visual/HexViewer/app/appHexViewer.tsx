import React from 'react';
import { AppStore } from '.';
import AppHexRoot from './appRoot';

export type DataProps = {
  data: string;
};

export default React.memo(({ data }: DataProps) => (
  <AppStore>
    <AppHexRoot data={data} />
  </AppStore>
));
