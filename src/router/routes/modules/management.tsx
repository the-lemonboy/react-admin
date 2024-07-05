import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const ProfilePage = lazy(() => import('@/pages/management/user/profile'));
const AccountPage = lazy(() => import('@/pages/management/user/account'));

const OrganizationPage = lazy(() => import('@/pages/management/system/organization'));
const MediaManagementPage = lazy(() => import('@/pages/management/website-management'));
const PermissioPage = lazy(() => import('@/pages/management/system/permission'));

const Blog = lazy(() => import('@/pages/management/blog'));

const management: AppRouteObject = {
  order: 2,
  path: 'management',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.management',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/management',
  },
  children: [
    {
      index: true,
      element: <Navigate to="user" replace />,
    },
    {
      path: 'user',
      meta: { label: 'sys.menu.user.index', key: '/management/user' },
      children: [
        {
          index: true,
          element: <Navigate to="profile" replace />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
          meta: { label: 'sys.menu.user.profile', key: '/management/user/profile' },
        },
        {
          path: 'account',
          element: <AccountPage />,
          meta: { label: 'sys.menu.user.account', key: '/management/user/account' },
        },
      ],
    },
    {
      path: 'system',
      meta: { label: 'sys.menu.system.index', key: '/management/system' },
      children: [
        {
          path: 'organization',
          element: <OrganizationPage />,
          meta: { label: 'sys.menu.system.organization', key: '/management/system/organization' },
        },
        {
          path: 'mediaManagementPage',
          element: <MediaManagementPage />,
          meta: {
            label: 'sys.menu.system.website-management',
            key: '/management/system/website-management',
          },
        },
        {
          path: 'permission',
          element: <PermissioPage />,
          meta: { label: 'sys.menu.system.permission', key: '/management/system/permission' },
        },
      ],
    },
    {
      path: 'blog',
      element: <Blog />,
      meta: { label: 'sys.menu.blog', key: '/management/blog' },
    },
  ],
};


// import { Suspense, lazy } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// import { SvgIcon } from '@/components/icon';
// import { CircleLoading } from '@/components/loading';

// import { AppRouteObject } from '#/router';

// // const HomePage = lazy(() => import(`@/pages/dashboard/workbench`));
// const HomePage = lazy(() => import(`@/pages/management/media-management`));
// const Analysis = lazy(() => import('@/pages/dashboard/analysis'));

// const dashboard: AppRouteObject = {
//   order: 1,
//   path: 'dashboard',
//   element: (
//     <Suspense fallback={<CircleLoading />}>
//       <Outlet />
//     </Suspense>
//   ),
//   meta: {
//     label: 'sys.menu.dashboard',
//     icon: <SvgIcon icon="ic-analysis" className="ant-menu-item-icon" size="24" />,
//     key: '/management',
//   },
//   children: [
//     {
//       index: true,
//       element: <Navigate to="media-management" replace />,
//     },
//     {
//       path: 'media-management',
//       element: <HomePage />,
//       meta: { label: 'sys.menu.system.media-management', key: '/management/media-management' },
//     },
//     {
//       path: 'analysis',
//       element: <Analysis />,
//       meta: { label: 'sys.menu.analysis', key: '/dashboard/analysis' },
//     },
//   ],
// };

// export default dashboard;

export default management;
