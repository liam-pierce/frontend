import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Collapse, Divider, IconButton, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useHighlighter from 'components/hooks/useHighlighter';
import useSafeResults from 'components/hooks/useSafeResults';
import Verdict from 'components/visual/Verdict';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const useStyles = makeStyles(theme => ({
  file_item: {
    cursor: 'pointer',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.hover
    },
    flexGrow: 1,
    width: '100%'
  },
  title: {
    cursor: 'pointer',
    '&:hover, &:focus': {
      color: theme.palette.text.secondary
    }
  },
  noMaxWidth: {
    maxWidth: 'none'
  }
}));

type FileItemProps = {
  children: {
    [key: string]: FileItemProps;
  };
  name: string[];
  score: number;
  sha256: string;
  size: number;
  truncated: boolean;
  type: string;
};

type FileTreeProps = {
  tree: {
    [key: string]: FileItemProps;
  };
  sid: string;
  force: boolean;
  defaultForceShown: Array<string>;
};

type FileTreeSectionProps = {
  tree: {
    [key: string]: FileItemProps;
  };
  sid: string;
  baseFiles: string[];
  force?: boolean;
};

const isVisible = (curItem, forcedShown, isHighlighted, showSafeResults) =>
  (curItem.score < 0 && !showSafeResults) ||
  curItem.score > 0 ||
  forcedShown.includes(curItem.sha256) ||
  isHighlighted(curItem.sha256) ||
  (curItem.children &&
    Object.values(curItem.children).some(c => isVisible(c, forcedShown, isHighlighted, showSafeResults)));

const WrappedFileTreeSection: React.FC<FileTreeSectionProps> = ({ tree, sid, baseFiles, force = false }) => {
  const { t } = useTranslation(['submissionDetail']);
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const classes = useStyles();
  const sp2 = theme.spacing(2);
  const [forcedShown, setForcedShown] = React.useState<Array<string>>([]);

  useEffect(() => {
    if (baseFiles && forcedShown.length === 0) {
      setForcedShown([...baseFiles]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFiles]);

  return (
    <div style={{ paddingTop: sp2 }}>
      <Typography
        variant="h6"
        onClick={() => {
          setOpen(!open);
        }}
        className={classes.title}
      >
        {t('tree')}
      </Typography>
      <Divider />
      <Collapse in={open} timeout="auto">
        <div style={{ paddingTop: sp2 }}>
          {tree !== null ? (
            <FileTree tree={tree} sid={sid} force={force} defaultForceShown={forcedShown} />
          ) : (
            [...Array(3)].map((_, i) => (
              <div style={{ display: 'flex' }} key={i}>
                <Skeleton style={{ height: '2rem', width: '1.5rem', marginRight: '0.5rem' }} />
                <Skeleton style={{ flexGrow: 1 }} />
              </div>
            ))
          )}
        </div>
      </Collapse>
    </div>
  );
};

const WrappedFileTree: React.FC<FileTreeProps> = ({ tree, sid, defaultForceShown, force = false }) => {
  const { t } = useTranslation('submissionDetail');
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const { isHighlighted } = useHighlighter();
  const { showSafeResults } = useSafeResults();
  const [forcedShown, setForcedShown] = React.useState<Array<string>>([...defaultForceShown]);

  return (
    <>
      {Object.keys(tree).map((sha256, i) => {
        const item = tree[sha256];
        return !isVisible(tree[sha256], defaultForceShown, isHighlighted, showSafeResults) ||
          (item.score < 0 && !showSafeResults && !force) ? null : (
          <div key={i}>
            <div style={{ display: 'flex', width: '100%' }}>
              {item.children &&
              Object.values(item.children).some(c => !isVisible(c, forcedShown, isHighlighted, showSafeResults)) ? (
                <Tooltip title={t('tree_more')}>
                  <IconButton
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => {
                      setForcedShown([...forcedShown, ...Object.keys(item.children)]);
                    }}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                </Tooltip>
              ) : item.children && Object.keys(item.children).some(key => forcedShown.includes(key)) ? (
                <Tooltip title={t('tree_less')}>
                  <IconButton
                    size="small"
                    style={{ padding: 0 }}
                    onClick={event => {
                      const excluded = Object.keys(item.children);
                      setForcedShown(forcedShown.filter(val => !excluded.includes(val)));
                    }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <span style={{ marginLeft: theme.spacing(3) }} />
              )}
              <Box
                className={classes.file_item}
                component={'span'}
                onClick={
                  item.sha256
                    ? () => {
                        navigate(`/submission/detail/${sid}/${item.sha256}?name=${encodeURI(item.name[0])}`);
                      }
                    : null
                }
                style={{
                  wordBreak: 'break-word',
                  backgroundColor: isHighlighted(sha256)
                    ? theme.palette.mode === 'dark'
                      ? '#343a44'
                      : '#d8e3ea'
                    : null
                }}
              >
                <span>
                  <Verdict score={item.score} mono short />
                  {`:: ${item.name.join(' | ')} `}
                  <span style={{ fontSize: '80%', color: theme.palette.text.secondary }}>{`[${item.type}]`}</span>
                </span>
              </Box>
            </div>
            <div style={{ marginLeft: theme.spacing(3) }}>
              <FileTree tree={item.children} sid={sid} force={force} defaultForceShown={forcedShown} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const FileTree = React.memo(WrappedFileTree);
const FileTreeSection = React.memo(WrappedFileTreeSection);

export default FileTreeSection;
