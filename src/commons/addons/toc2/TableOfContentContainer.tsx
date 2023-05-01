import makeStyles from '@mui/styles/makeStyles';
import { useEffect } from 'react';
import { useTableOfContentStore } from './TableOfContent';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'grid',
    marginTop: '-64px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 242px'
    }
  },
  content: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: '64px'
  },
  toc: {
    display: 'none',
    height: '100vh',
    overflowY: 'auto',
    paddingBottom: '32px',
    paddingLeft: '2px',
    paddingRight: '32px',
    paddingTop: '100px',
    position: 'sticky',
    top: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

type TableOfContentContainerProps = {
  children: React.ReactNode;
};

export const TableOfContentContainer = ({ children }: TableOfContentContainerProps) => {
  const classes = useStyles();

  const [anchors, setStore] = useTableOfContentStore(store => store.anchors);

  useEffect(() => () => setStore({ anchors: [] }), [setStore]);

  console.log(anchors);

  return (
    <main className={classes.main}>
      <div id="main-content" className={classes.content}>
        {children}
      </div>
      <nav id="table-of-content" className={classes.toc}>
        {anchors.map(anchor => (
          <div key={`${anchor.hash}`}>{`${anchor.title}`}</div>
        ))}
      </nav>
    </main>
  );
};
