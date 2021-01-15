import { useMediaQuery, useTheme } from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import AmpStoriesOutlinedIcon from '@material-ui/icons/AmpStoriesOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import CodeOutlinedIcon from '@material-ui/icons/CodeOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FingerprintOutlinedIcon from '@material-ui/icons/FingerprintOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import NotificationImportantOutlinedIcon from '@material-ui/icons/NotificationImportantOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import SearchIcon from '@material-ui/icons/Search';
import SettingsApplicationsOutlinedIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SimCardOutlinedIcon from '@material-ui/icons/SimCardOutlined';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import { AppLayoutProps } from 'commons/components/layout/LayoutProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiNetworkChart } from 'react-icons/bi';

const useMyLayout = (): AppLayoutProps => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only('xs'));
  const MENU_ITEMS = [
    {
      type: 'item' as 'item',
      element: {
        id: 'submit',
        text: t('drawer.submit'),
        icon: <PublishOutlinedIcon />,
        route: '/submit',
        nested: false
      }
    },
    {
      type: 'item' as 'item',
      element: {
        id: 'submissions',
        text: t('drawer.submissions'),
        icon: <AmpStoriesOutlinedIcon />,
        route: '/submissions',
        nested: false
      }
    },
    {
      type: 'item' as 'item',
      element: {
        id: 'alerts',
        text: t('drawer.alerts'),
        icon: <NotificationImportantOutlinedIcon />,
        route: '/alerts',
        nested: false
      }
    },
    {
      type: 'item' as 'item',
      element: {
        id: 'dashboard',
        text: t('drawer.dashboard'),
        icon: <DashboardOutlinedIcon />,
        route: '/dashboard',
        nested: false
      }
    },
    {
      type: 'divider' as 'divider',
      element: null
    },
    {
      type: 'group' as 'group',
      element: {
        id: 'manage',
        title: t('drawer.manage'),
        icon: <BuildOutlinedIcon />,
        items: [
          {
            id: 'manage.heuristics',
            text: t('drawer.manage.heuristics'),
            icon: <SimCardOutlinedIcon />,
            route: '/manage/heuristics',
            nested: true
          },
          {
            id: 'manage.signatures',
            text: t('drawer.manage.signatures'),
            icon: <FingerprintOutlinedIcon />,
            route: '/manage/signatures',
            nested: true
          },
          {
            id: 'manage.source',
            text: t('drawer.manage.source'),
            userPropValidators: [
              { prop: 'user.is_admin', value: true },
              { prop: 'user.roles', value: 'signature_manager' }
            ],
            icon: <CodeOutlinedIcon />,
            route: '/manage/sources',
            nested: true
          },
          {
            id: 'manage.workflow',
            text: t('drawer.manage.workflow'),
            icon: <BiNetworkChart />,
            route: '/manage/workflows',
            nested: true
          }
        ]
      }
    },
    {
      type: 'group' as 'group',
      element: {
        id: 'stats',
        title: t('drawer.stats'),
        icon: <EqualizerOutlinedIcon />,
        items: [
          {
            id: 'stats.heuristics',
            text: t('drawer.stats.heuristics'),
            icon: <SimCardOutlinedIcon />,
            route: '/stats/heuristics',
            nested: true
          },
          {
            id: 'stats.signatures',
            text: t('drawer.stats.signatures'),
            icon: <FingerprintOutlinedIcon />,
            route: '/stats/signatures',
            nested: true
          }
        ]
      }
    },
    {
      type: 'group' as 'group',
      element: {
        id: 'search',
        title: t('drawer.search'),
        icon: <SearchIcon />,
        items: [
          {
            id: 'search.all',
            text: t('drawer.search.all'),
            route: '/search',
            nested: true
          },
          {
            id: 'search.alert',
            text: t('drawer.search.alert'),
            route: '/search/alert',
            nested: true
          },
          {
            id: 'search.file',
            text: t('drawer.search.file'),
            route: '/search/file',
            nested: true
          },
          {
            id: 'search.result',
            text: t('drawer.search.result'),
            route: '/search/result',
            nested: true
          },
          {
            id: 'search.signature',
            text: t('drawer.search.signature'),
            route: '/search/signature',
            nested: true
          },
          {
            id: 'search.submission',
            text: t('drawer.search.submission'),
            route: '/search/submission',
            nested: true
          }
        ]
      }
    },
    {
      type: 'divider' as 'divider',
      element: null
    },
    {
      type: 'group' as 'group',
      element: {
        id: 'help',
        title: t('drawer.help'),
        icon: <HelpOutlineOutlinedIcon />,
        items: [
          {
            id: 'help.api',
            text: t('drawer.help.api'),
            icon: <AssignmentOutlinedIcon />,
            route: '/help/api',
            nested: true
          },
          {
            id: 'help.classification',
            text: t('drawer.help.classification'),
            userPropValidators: [{ prop: 'c12nDef.enforce', value: true }],
            icon: <LabelOutlinedIcon />,
            route: '/help/classification',
            nested: true
          },
          {
            id: 'help.configuration',
            text: t('drawer.help.configuration'),
            icon: <SettingsApplicationsOutlinedIcon />,
            route: '/help/configuration',
            nested: true
          },
          {
            id: 'help.search',
            text: t('drawer.help.search'),
            icon: <SearchIcon />,
            route: '/help/search',
            nested: true
          },
          {
            id: 'help.services',
            text: t('drawer.help.services'),
            icon: <AccountTreeOutlinedIcon />,
            route: '/help/services',
            nested: true
          }
        ]
      }
    }
  ];

  const APP_SWITCHER_ITEMS = [
    //  {
    //    alt: "AL",
    //    name: "Assemblyline",
    //    img_d: "/images/al_dark.svg",
    //    img_l: "/images/al.svg",
    //    route: "https://localhost"
    //  },
  ];

  const USER_MENU_ITEMS = [
    {
      name: t('usermenu.account'),
      route: '/account',
      icon: <AccountCircleOutlinedIcon />
    },
    {
      name: t('usermenu.settings'),
      route: '/settings',
      icon: <SettingsOutlinedIcon />
    },
    {
      name: t('usermenu.optout'),
      route: '/optout',
      icon: <CancelPresentationIcon />
    },
    {
      name: t('usermenu.logout'),
      route: '/logout',
      icon: <ExitToAppIcon />
    }
  ];

  const ADMIN_MENU_ITEMS = [
    {
      name: t('adminmenu.errors'),
      route: '/admin/errors',
      icon: <ErrorOutlineOutlinedIcon />
    },
    {
      name: t('adminmenu.services'),
      route: '/admin/services',
      icon: <AccountTreeOutlinedIcon />
    },
    {
      name: t('adminmenu.sitemap'),
      route: '/admin/sitemap',
      icon: <MapOutlinedIcon />
    },
    {
      name: t('adminmenu.users'),
      route: '/admin/users',
      icon: <SupervisorAccountOutlinedIcon />
    }
  ];

  const darkLogo = (
    <img
      alt={t('logo.alt')}
      src={`${process.env.PUBLIC_URL}/images/al_dark.svg`}
      width="40"
      height="32"
      style={{ marginLeft: '-5px' }}
    />
  );
  const lightLogo = (
    <img
      alt={t('logo.alt')}
      src={`${process.env.PUBLIC_URL}/images/al.svg`}
      width="40"
      height="32"
      style={{ marginLeft: '-5px' }}
    />
  );
  const darkBanner = (
    <img
      style={{ display: 'inline-block', width: '100%', margin: `${isXS ? 2 : 3}rem 0` }}
      src={`${process.env.PUBLIC_URL}/images/banner_dark.svg`}
      alt={t('banner.alt')}
    />
  );
  const lightBanner = (
    <img
      style={{ display: 'inline-block', width: '100%', margin: `${isXS ? 2 : 3}rem 0` }}
      src={`${process.env.PUBLIC_URL}/images/banner.svg`}
      alt={t('banner.alt')}
    />
  );

  return {
    appName: 'Assemblyline',
    allowBreadcrumbsMinimize: false,
    allowReset: false,
    appIconDark: darkLogo,
    appIconLight: lightLogo,
    bannerLight: lightBanner,
    bannerDark: darkBanner,
    defaultLayout: 'side' as 'side',
    defaultDrawerOpen: false,
    defaultShowQuickSearch: true,
    defaultAutoHideAppbar: true,
    defaultShowBreadcrumbs: true,
    defaultBreadcrumbsOpen: true,
    leftnav: {
      elements: MENU_ITEMS,
      hideNestedIcons: true
    },
    topnav: {
      adminMenu: ADMIN_MENU_ITEMS,
      adminMenuTitle: t('adminmenu'),
      apps: APP_SWITCHER_ITEMS,
      quickSearchURI: '/search',
      quickSearchParam: 'query',
      themeSelectionUnder: 'icon' as 'icon',
      userMenu: USER_MENU_ITEMS,
      userMenuTitle: t('usermenu')
    }
  };
};

export default useMyLayout;
