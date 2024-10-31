import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';
const DailyIncreasePage = lazy(() => import('@/pages/exchange/risingStars/daily'));
const WeeklyIncreasePage = lazy(() => import('@/pages/exchange/risingStars/weekly'));
const MonthlyIncreasePage = lazy(() => import('@/pages/exchange/risingStars/monthly'));

const ExchangeRoutes: AppRouteObject = {
  order: 5,
  path: 'exchange',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.exchange',
    icon: <SvgIcon icon="ic_exchange" className="ant-menu-item-icon" size="24" />,
    key: '/exchange',
  },
  children: [
    { index: true, element: <Navigate to="daily" replace /> },
    {
      path: 'risingStars',
      meta: { label: 'sys.menu.exchange.index', key: '/exchange/risingStars' },
      children: [
        { index: true, element: <Navigate to="daily" replace /> },
        {
          path: 'monthly',
          element: <MonthlyIncreasePage />,
          meta: {
            label: 'sys.menu.exchange.monthly',
            key: '/exchange/monthly',
          },
        },
        {
          path: 'daily',
          element: <DailyIncreasePage />,
          meta: {
            label: 'sys.menu.exchange.daily',
            key: '/exchange/daily',
          },
        },
        {
          path: 'weekly',
          element: <WeeklyIncreasePage />,
          meta: {
            label: 'sys.menu.exchange.weekly',
            key: '/exchange/weekly',
          },
        },
      ],
    },
  ],
};
export default ExchangeRoutes;