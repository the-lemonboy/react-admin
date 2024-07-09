import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const WebsiteManagementPage = lazy(() => import('@/pages/management/website-management'));
const MemberLevelPage = lazy(() => import('@/pages/member/rssdao/member-level'));
const ConsumerCardPage = lazy(() => import('@/pages/member/rssdao/consumer-card'));
const MediaManagementPage = lazy(() => import('@/pages/news/media-management'));
const ThesaurusTagPage = lazy(() => import('@/pages/news/theasaurus-tag')); // 修正为ThesaurusTagPage

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
      path: 'website-management', // 修改路径为连字符命名法
      element: <WebsiteManagementPage />,
      meta: {
        label: 'sys.menu.system.website-management',
        key: '/management/website-management',
      },
    },
    // {
    //   path: 'member-level', // 修改路径为连字符命名法
    //   element: <MemberLevelPage />,
    //   meta: {
    //     label: 'sys.menu.system.member-level',
    //     key: '/management/system/member-level',
    //   },
    // },
    // {
    //   path: 'consumer-card', // 修改路径为连字符命名法
    //   element: <ConsumerCardPage />,
    //   meta: {
    //     label: 'sys.menu.system.consumer-card',
    //     key: '/management/system/consumer-card',
    //   },
    // },
    {
      path: 'media-management', // 修改路径为连字符命名法
      element: <MediaManagementPage />,
      meta: {
        label: 'sys.menu.media-management', // 修正meta标签
        key: '/management/media-management',
      },
    },
    {
      path: 'thesaurus-tag', // 修改路径为连字符命名法，并修正为ThesaurusTagPage
      element: <ThesaurusTagPage />,
      meta: {
        label: 'sys.menu.thesaurus-tag', // 修正meta标签
        key: '/management/thesaurus-tag',
      },
    },
  ],
};

export default management;
