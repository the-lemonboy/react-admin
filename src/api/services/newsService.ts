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
export interface CreateMediaReq {
  area_id?: string;
  title: string;
  id?: string;
  opt_status: boolean;
}
export interface GetCategoryListReq {
  area_id?: string;
}
export enum NewsType {
  MediaList = '/api/nav/media/news/list',
  CreateMedia = '/api/nav/media_content/area/update',
  UpdateNews = '/api/news/update',
  DeleteNews = '/api/news/delete',
  GetTheasaurusList = '/api/nav/media_content/area/list',
  GetCategoryList = '/api/nav/media_content/category/list',
}

const GetMediaList = (data: GetMediaListReq) =>
  apiClient.post<any>({ url: NewsType.MediaList, data });
const CreateMedia = (data: CreateMediaReq) =>
  apiClient.post<any>({ url: NewsType.CreateMedia, data });
const GetTheasaurusList = () => apiClient.get<any>({ url: NewsType.GetTheasaurusList });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post<any>({ url: NewsType.GetCategoryList, data });
export default {
  GetMediaList,
  CreateMedia,
  GetTheasaurusList,
  GetCategoryList,
};
