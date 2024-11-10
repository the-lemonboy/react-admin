import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

// Lazy load components
const MemberLevelPage = lazy(() => import('@/pages/member/rssdao/member-level'));
const ConsumerCardPage = lazy(() => import('@/pages/member/rssdao/consumer-card'));
const UserPage = lazy(() => import('@/pages/member/rssdao/user'));

const member: AppRouteObject = {
  order: 6,
  path: 'member',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.member',
    icon: <SvgIcon icon="ic_member" className="ant-menu-item-icon" size="24" />,
    key: '/member',
  },
  children: [
    {
      index: true,
      element: <Navigate to="rssdao" replace />,
    },
    {
      path: 'rssdao',
      meta: {
        label: 'sys.menu.rssdao.index',
        icon: <SvgIcon icon="ic-logo" className="ant-menu-item-icon" size="24" />,
        key: '/member/rssdao',
      },
      children: [
        {
          index: true,
          element: <Navigate to="member-level" replace />,
        },
        {
          path: 'member-level',
          element: <MemberLevelPage />,
          meta: {
            label: 'sys.menu.rssdao.member-level',
            icon: <SvgIcon icon="ic_member-grade" className="ant-menu-item-icon" size="18" />,

            key: '/member/rssdao/member-level',
          },
        },
        {
          path: 'consumer-card',
          element: <ConsumerCardPage />,
          meta: {
            label: 'sys.menu.rssdao.consumer-card',
            icon: <SvgIcon icon="ic_resume-card" className="ant-menu-item-icon" size="18" />,
            key: '/member/rssdao/consumer-card',
          },
        },
        {
          path: 'user',
          element: <UserPage />,
          meta: {
            label: 'sys.menu.rssdao.user',
            icon: <SvgIcon icon="ic_user-management" className="ant-menu-item-icon" size="18" />,
            key: '/member/rssdao/user',
          },
        },
      ],
    },
  ],
};

export default member;
