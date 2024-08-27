import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const TwitterCategoryPage = lazy(() => import('@/pages/twitter/tag-management/category-tag'));
const TwitterTheasaurusPage = lazy(() => import('@/pages/twitter/tag-management/theasaurus-tag'));
const CountPage = lazy(() => import('@/pages/twitter/twitter-management/count'));
const ArticelPage = lazy(() => import('@/pages/twitter/articel-management/content'));
const SessionPage = lazy(() => import('@/pages/twitter/articel-management/session'));
const pilotSpecial: AppRouteObject = {
  order: 4,
  path: 'twitter-management',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.twitter-management',
    icon: <SvgIcon icon="ic_pilot" className="ant-menu-item-icon" size="24" />,
    key: '/twitter-management',
  },
  children: [
    {
      index: true,
      element: <Navigate to="twitter-management" replace />,
    },
    {
      path: 'tag-management',
      meta: {
        label: 'sys.menu.tag-management.index',
        key: '/twitter-management/tag-management',
      },
      children: [
        { index: true, element: <Navigate to="category-tag" replace /> },
        {
          path: 'theasaurus-tag',
          element: <TwitterTheasaurusPage />,
          meta: {
            label: 'sys.menu.tag-management.theasaurus-tag',
            key: '/twitter-management/tag-management/theasaurus-tag',
          },
        },
        {
          path: 'category-tag',
          element: <TwitterCategoryPage />,
          meta: {
            label: 'sys.menu.tag-management.category-tag',
            key: '/twitter-management/tag-management/category-tag',
          },
        },
      ],
    },
    {
      path: 'count-management',
      meta: {
        label: 'sys.menu.count-management.index',
        key: '/twitter-management/count-management',
      },
      children: [
        { index: true, element: <Navigate to="count" replace /> },
        {
          path: 'count',
          element: <CountPage />,
          meta: {
            label: 'sys.menu.count-management.count',
            key: '/twitter-management/count-management/count',
          },
        },
      ],
    },
    {
      path: 'articel-management',
      meta: {
        label: 'sys.menu.articel-management.index',
        key: '/twitter-management/articel-management',
      },
      children: [
        { index: true, element: <Navigate to="category-tag" replace /> },
        {
          path: 'articel',
          element: <ArticelPage />,
          meta: {
            label: 'sys.menu.articel-management.articel',
            key: '/twitter-management/articel-management/articel',
          },
        },
        {
          path: 'session-tag',
          element: <SessionPage />,
          meta: {
            label: 'sys.menu.articel-management.session',
            key: '/twitter-management/articel-management/session',
          },
        },
      ],
    },
  ],
};

export default pilotSpecial;
