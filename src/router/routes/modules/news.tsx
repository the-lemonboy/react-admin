import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const MediaManagementPage = lazy(() => import('@/pages/news/media-management'));
const ThesaurusTagPage = lazy(() => import('@/pages/news/theasaurus-tag')); // 修正为ThesaurusTagPage
const NewsCategoryTagPage = lazy(() => import('@/pages/news/category-tag'));
const ArticleListPage = lazy(() => import('@/pages/news/article-list'));
const NewsListPage = lazy(() => import('@/pages/news/news-list'));
const news: AppRouteObject = {
  order: 3,
  path: 'news',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.news',
    icon: <SvgIcon icon="ic_news" className="ant-menu-item-icon" size="24" />,
    key: '/news',
  },
  children: [
    {
      index: true,
      element: <Navigate to="media-management" replace />,
    },
    {
      path: 'media-management', // 修改路径为连字符命名法
      element: <MediaManagementPage />,
      meta: {
        label: 'sys.menu.media-management',
        key: '/news/media-management',
      },
    },
    {
      path: 'theasaurus-tag',
      element: <ThesaurusTagPage />,
      meta: {
        label: 'sys.menu.theasaurus-tag',
        key: '/news/theasaurus-tag',
      },
    },
    {
      path: 'newscategory',
      element: <NewsCategoryTagPage />,
      meta: {
        label: 'sys.menu.newscatagory-tag',
        key: '/news/newscategory',
      },
    },
    {
      path: 'newslist',
      element: <NewsListPage />,
      meta: {
        label: 'sys.menu.news-list',
        key: '/news/newslist',
      },
    },
    {
      path: 'articlelist',
      element: <ArticleListPage />,
      meta: {
        label: 'sys.menu.article-list',
        key: '/news/articlelist',
      },
    },
  ],
};

export default news;
