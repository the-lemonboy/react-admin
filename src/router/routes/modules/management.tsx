import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

// const ProfilePage = lazy(() => import('@/pages/management/user/profile'));
// const AccountPage = lazy(() => import('@/pages/management/user/account'));

// const OrganizationPage = lazy(() => import('@/pages/management/system/organization'));
const WebsiteManagementPage = lazy(() => import('@/pages/management/website-management'));
// const PermissioPage = lazy(() => import('@/pages/management/system/permission'));

// const Blog = lazy(() => import('@/pages/management/blog'));
const MemberLevelPage = lazy(() => import('@/pages/member/rssdao/member-level'));
const ConsumerCardPage = lazy(() => import('@/pages/member/rssdao/consumer-card'));
const MediaManagementPage = lazy(() => import('@/pages/news/media-management'));
// const TheasaurusTagPage = lazy(() => import('@/pages/news/theasaurus-tag'));
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
      element: <Navigate to="website-management" replace />,
    },
    {
      path: 'websiteManagementPage',
      element: <WebsiteManagementPage />,
      meta: {
        label: 'sys.menu.system.website-management',
        key: '/management/system/website-management',
      },
    },
    {
      path: 'memberLevelPage',
      element: <MemberLevelPage />,
      meta: {
        label: 'sys.menu.system.member-level',
        key: '/management/system/member-level',
      },
    },
    {
      path: 'consumerCardPage',
      element: <ConsumerCardPage />,
      meta: {
        label: 'sys.menu.system.consumer-card',
        key: '/management/system/consumer-card',
      },
    },
    
    // {
    //   path: 'mediaManagementPage',
    //   element: <TheasaurusTagPage />,
    //   meta: {
    //     label: 'sys.menu.theasaurus-tag',
    //     key: '/management/theasaurus-tag',
    //   },
    // },
    {
      path: 'theasaurusTagPage',
      element: <MediaManagementPage />,
      meta: {
        label: 'sys.menu.media-management',
        key: '/management/media-management',
      },
    },
  ],
};

export default management;
