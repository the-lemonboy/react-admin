import apiClient from '../apiClient';

export interface GetMediaListReq {
  area_id: string;
  content: string;
  date_range: string;
  exchange_media: string;
  last_level_cats: string;
  level_cat: string;
  limit: number;
  page: number;
}
export interface AddMediaReq {
  media_title: string;
  opt_status: true;
}
export interface AddTheasaurusReq {
  area_id: string;
  title: string;
  id?: string;
  opt_status: boolean;
}
export interface GetCategoryListReq {
  area_id: string;
}
export interface AddCategoryReq {
  opt_status: boolean;
  title: string;
}
export interface ChangeMediaStatusReq {
  media_title: string;
  opt_status: boolean;
}
export interface UpdateNewsReq {
  area_id: string;
  c_id: string;
  opt_status: boolean;
  p_c_id: string;
  title: string;
  word_key: string;
}
export interface SearchNewsListReq {
  area_id: string;
  content: string;
  date_range: string;
  exchange_media: string;
  last_level_cats: string;
  level_cat: string;
  limit: number;
  page: number;
}
export interface GetChildCategoryListReq {
  area_id: string;
  level: number;
  p_c_id: string;
}
export interface GetNewsListReq {
  area_id: string;
  content: string;
  date_range: string;
  exchange_media: string;
  last_level_cats: string;
  level_cat: string;
  limit: number;
  page: number;
}
export interface ChangeCategoryStatusReq {
  c_id: string;
  opt_status: boolean;
}
export enum NewsType {
  AddMedia = '/api/media/add',
  MediaList = '/api/media/list',
  ChangeMediaStatus = '/api/media/opt_status',
  // CreateMedia = '/api/media_content/area/update',
  AddTheasaurus = '/api/media_content/area/add',
  ChangeTheasaurusStatus = '/api/media_content/area/opt_status',
  UpdateNews = '/api/news/update',
  DeleteNews = '/api/news/delete',
  GetTheasaurusList = '/api/media_content/area/list',
  GetCategoryList = '/api/media_content/category/list',
  AddCategory = '/api/media_content/category/add',
  UpdateCategory = '/api/media_content/category/update',
  SearchNewsList = '/api/media/flashnews/search',
  GetChildCateGory = '/api/media_content/level/category/list',
  NewsList = '/api/media/flashnews/list',
  ArticelList = '/api/media/news/search',
  ChangeCategoryStatus = '/api/media_content/category/opt_status',
  GetArticleKeyword = '/api/media/news/keyword_rc5',
  GetNewsKeyword = '/api/media/flashnews/keyword_rc5',
  // DelCateGory = ''
}

const AddMedia = (data: any) => apiClient.post<any>({ url: NewsType.AddMedia, data });
const GetMediaList = () => apiClient.get<any>({ url: NewsType.MediaList });
const ChangeMediaStatus = (data: ChangeMediaStatusReq) =>
  apiClient.post<any>({ url: NewsType.ChangeMediaStatus, data });
// const CreateMedia = (data: CreateMediaReq) =>
//   apiClient.post<any>({ url: NewsType.CreateMedia, data });
const GetTheasaurusList = () => apiClient.get<any>({ url: NewsType.GetTheasaurusList });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post<any>({ url: NewsType.GetCategoryList, data });
const AddCategory = (data: any) => apiClient.post<any>({ url: NewsType.AddCategory, data });
const AddTheasaurus = (data: AddTheasaurusReq) =>
  apiClient.post<any>({ url: NewsType.AddTheasaurus, data });
const ChangeTheasaurusStatus = (data: AddTheasaurusReq) =>
  apiClient.post<any>({ url: NewsType.ChangeTheasaurusStatus, data });
const DelCateGory = (category_id: any) =>
  apiClient.get<any>({ url: `/api/media_content/category/del/${category_id}` });
const UpdateCategory = (data: UpdateNewsReq) =>
  apiClient.post<any>({ url: NewsType.UpdateCategory, data });
const SearchNewsList = (data: SearchNewsListReq) =>
  apiClient.post<any>({ url: NewsType.SearchNewsList, data });
const GetChildCateGory = (data: GetChildCategoryListReq) =>
  apiClient.post<any>({ url: NewsType.GetChildCateGory, data });
const GetNewsList = (data: GetNewsListReq) => apiClient.post<any>({ url: NewsType.NewsList, data });
const GetArticelList = (data: GetNewsListReq) =>
  apiClient.post<any>({ url: NewsType.ArticelList, data });
const GetNewDetail = (flash_key: string) =>
  apiClient.get<any>({ url: `/api/media/flashnews/${flash_key}` });
const GetArticelDetail = (news_key: string) =>
  apiClient.get<any>({ url: `/api/media/news/${news_key}` });
const ChangeCategoryStatus = (data: ChangeCategoryStatusReq) =>
  apiClient.post<any>({ url: NewsType.ChangeCategoryStatus, data });
const GetArticleKeyword = () => apiClient.get<any>({ url: NewsType.GetArticleKeyword });
const GetNewsKeyword = () => apiClient.get<any>({ url: NewsType.GetNewsKeyword });
export default {
  AddMedia,
  GetMediaList,
  ChangeMediaStatus,
  AddCategory,
  // CreateMedia,
  GetTheasaurusList,
  GetCategoryList,
  AddTheasaurus,
  ChangeTheasaurusStatus,
  DelCateGory,
  UpdateCategory,
  SearchNewsList,
  GetChildCateGory,
  GetNewsList,
  GetArticelList,
  GetNewDetail,
  GetArticelDetail,
  ChangeCategoryStatus,
  GetArticleKeyword,
  GetNewsKeyword,
};
