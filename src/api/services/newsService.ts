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
export interface AddTheasaurusReq {
  area_id?: string;
  title: string;
  id?: string;
  opt_status: boolean;
}
export interface GetCategoryListReq {
  area_id?: string;
}
export interface AddCategoryReq {
  opt_status: boolean;
  title: string;
}
export interface ChangeMediaStatusReq {
  media_title: string;
  opt_status: boolean;
}
export enum NewsType {
  MediaList = '/api/nav/media/list',
  ChangeMediaStatus = '/api/nav/media/opt_status',
  CreateMedia = '/api/nav/media_content/area/update',
  AddTheasaurus = '/api/nav/media_content/area/add',
  ChangeTheasaurusStatus = '/api/nav/media_content/area/opt_status',
  UpdateNews = '/api/news/update',
  DeleteNews = '/api/news/delete',
  GetTheasaurusList = '/api/nav/media_content/area/list',
  GetCategoryList = '/api/nav/media_content/category/list',
  AddCategory = '/api/nav/media_content/category/add',
}

const GetMediaList = () => apiClient.get<any>({ url: NewsType.MediaList });
const ChangeMediaStatus = (data: ChangeMediaStatusReq) =>
  apiClient.post<any>({ url: NewsType.ChangeMediaStatus, data });
const CreateMedia = (data: CreateMediaReq) =>
  apiClient.post<any>({ url: NewsType.CreateMedia, data });
const GetTheasaurusList = () => apiClient.get<any>({ url: NewsType.GetTheasaurusList });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post<any>({ url: NewsType.GetCategoryList, data });
const AddCategory = (data: any) => apiClient.post<any>({ url: NewsType.AddCategory, data });
const AddTheasaurus = (data: AddTheasaurusReq) =>
  apiClient.post<any>({ url: NewsType.AddTheasaurus, data });
const ChangeTheasaurusStatus = (data: AddTheasaurusReq) =>
  apiClient.post<any>({ url: NewsType.ChangeTheasaurusStatus, data });
export default {
  GetMediaList,
  ChangeMediaStatus,
  CreateMedia,
  GetTheasaurusList,
  GetCategoryList,
  AddTheasaurus,
  ChangeTheasaurusStatus,
};
