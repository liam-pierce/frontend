import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BugReportIcon from '@material-ui/icons/BugReport';
import PersonIcon from '@material-ui/icons/Person';
import PageFullWidth from 'commons/components/layout/pages/PageFullWidth';
import PageHeader from 'commons/components/layout/pages/PageHeader';
import useALContext from 'components/hooks/useALContext';
import useMyAPI from 'components/hooks/useMyAPI';
import SearchBar from 'components/visual/SearchBar/search-bar';
import { DEFAULT_SUGGESTION } from 'components/visual/SearchBar/search-textfield';
import SimpleSearchQuery from 'components/visual/SearchBar/simple-search-query';
import SearchPager from 'components/visual/SearchPager';
import SubmissionsTable, { SubmissionResult } from 'components/visual/SearchResult/submissions';
import SearchResultCount from 'components/visual/SearchResultCount';
import 'moment/locale/fr';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

const PAGE_SIZE = 25;

const useStyles = makeStyles(theme => ({
  searchresult: {
    fontStyle: 'italic',
    paddingTop: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
  }
}));

type SearchResults = {
  items: SubmissionResult[];
  offset: number;
  rows: number;
  total: number;
};

export default function Submissions() {
  const { t } = useTranslation(['submissions']);
  const [pageSize] = useState(PAGE_SIZE);
  const [submissionResults, setSubmissionResults] = useState<SearchResults>(null);
  const [searching, setSearching] = useState(false);
  const { user: currentUser, indexes } = useALContext();
  const history = useHistory();
  const { apiCall } = useMyAPI();
  const theme = useTheme();
  const location = useLocation();
  const [query, setQuery] = useState<SimpleSearchQuery>(null);
  const upMD = useMediaQuery(theme.breakpoints.up('md'));
  const filterValue = useRef<string>('');
  const classes = useStyles();
  const [suggestions] = useState([
    ...Object.keys(indexes.submission).filter(name => indexes.submission[name].indexed),
    ...DEFAULT_SUGGESTION
  ]);

  const onClear = () => {
    history.push(location.pathname);
  };

  const onSearch = () => {
    if (filterValue.current !== '') {
      query.set('query', filterValue.current);
      history.push(`${location.pathname}?${query.toString()}`);
    } else {
      onClear();
    }
  };

  const onFilterValueChange = (inputValue: string) => {
    filterValue.current = inputValue;
  };

  useEffect(() => {
    setSearching(true);
    setQuery(new SimpleSearchQuery(location.search, `query=*&rows=${pageSize}&offset=0`));
  }, [location.search, pageSize]);

  useEffect(() => {
    if (query) {
      query.set('rows', pageSize);
      query.set('offset', 0);
      apiCall({
        method: 'POST',
        url: '/api/v4/search/submission/',
        body: query.getParams(),
        onSuccess: api_data => {
          setSubmissionResults(api_data.api_response);
        },
        onFinalize: () => {
          setSearching(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <PageFullWidth margin={4}>
      <div style={{ paddingBottom: theme.spacing(2) }}>
        <Typography variant="h4">{t('title')}</Typography>
      </div>
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
            buttons={[
              {
                icon: <PersonIcon fontSize={upMD ? 'medium' : 'small'} />,
                tooltip: t('my_submission'),
                props: {
                  onClick: () => {
                    query.set('query', `params.submitter:"${currentUser.username}"`);
                    history.push(`${location.pathname}?${query.getDeltaString()}`);
                  }
                }
              },
              {
                icon: <AssignmentTurnedInIcon fontSize={upMD ? 'medium' : 'small'} />,
                tooltip: t('completed_submissions'),
                props: {
                  onClick: () => {
                    query.set('query', 'state:completed');
                    history.push(`${location.pathname}?${query.getDeltaString()}`);
                  }
                }
              },
              {
                icon: <BugReportIcon fontSize={upMD ? 'medium' : 'small'} />,
                tooltip: t('malicious_submissions'),
                props: {
                  onClick: () => {
                    query.set('query', 'max_score:>=1000');
                    history.push(`${location.pathname}?${query.getDeltaString()}`);
                  }
                }
              }
            ]}
          >
            {submissionResults !== null && (
              <div className={classes.searchresult}>
                {submissionResults.total !== 0 && (
                  <Typography variant="subtitle1" color="secondary" style={{ flexGrow: 1 }}>
                    {searching ? (
                      <span>{t('searching')}</span>
                    ) : (
                      <span>
                        <SearchResultCount count={submissionResults.total} />
                        {query.get('query')
                          ? t(`filtered${submissionResults.total === 1 ? '' : 's'}`)
                          : t(`total${submissionResults.total === 1 ? '' : 's'}`)}
                      </span>
                    )}
                  </Typography>
                )}

                <SearchPager
                  total={submissionResults.total}
                  setResults={setSubmissionResults}
                  pageSize={pageSize}
                  index="submission"
                  query={query}
                  setSearching={setSearching}
                />
              </div>
            )}
          </SearchBar>
        </div>
      </PageHeader>
      <div style={{ paddingTop: theme.spacing(2), paddingLeft: theme.spacing(0.5), paddingRight: theme.spacing(0.5) }}>
        <SubmissionsTable submissionResults={submissionResults} />
      </div>
    </PageFullWidth>
  );
}
