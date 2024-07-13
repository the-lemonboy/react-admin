import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const PlanetCategotyPage = lazy(
  () => import('@/pages/pilot-special/knowledge-planet/category-tag'),
);
const PlanetTheasaurusPage = lazy(
  () => import('@/pages/pilot-special/knowledge-planet/theasaurus-tag'),
);
const TGCategoryPage = lazy(() => import('@/pages/pilot-special/TG-community/category-tag'));
const TGTheasaurusPage = lazy(() => import('@/pages/pilot-special/TG-community/theasaurus-tag'));
const pilotSpecial: AppRouteObject = {
  order: 5,
  path: 'pilot-special',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.pilot-special',
    icon: <SvgIcon icon="ic_pilot" className="ant-menu-item-icon" size="24" />,
    key: '/pilot-special',
  },
  children: [
    {
      index: true,
      element: <Navigate to="knowledge-planet" replace />,
    },
    {
      path: 'knowledge-planet',
      meta: { label: 'sys.menu.knowledge-planet.index', key: '/pilot-special/knowledge-planet' },
      children: [
        { index: true, element: <Navigate to="category-tag" replace /> },
        {
          path: 'category-tag',
          element: <PlanetCategotyPage />,
          meta: {
            label: 'sys.menu.knowledge-planet.category-tag',
            key: '/pilot-special/knowledge-planet/category-tag',
          },
        },
        {
          path: 'theasaurus-tag',
          element: <PlanetTheasaurusPage />,
          meta: {
            label: 'sys.menu.knowledge-planet.theasaurus-tag',
            key: '/pilot-special/knowledge-planet/theasaurus-tag',
          },
        },
      ],
    },
    {
      path: 'TG-community',
      meta: { label: 'sys.menu.TG-community.index', key: '/pilot-special/TG-community' },
      children: [
        { index: true, element: <Navigate to="category-tag" replace /> },
        {
          path: 'category-tag',
          element: <TGCategoryPage />,
          meta: {
            label: 'sys.menu.TG-community.category-tag',
            key: '/pilot-special/TG-community/category-tag',
          },
        },
        {
          path: 'theasaurus-tag',
          element: <TGTheasaurusPage />,
          meta: {
            label: 'sys.menu.TG-community.theasaurus-tag',
            key: '/pilot-special/TG-community/theasaurus-tag',
          },
        },
      ],
    },
  ],
};

export default pilotSpecial;
