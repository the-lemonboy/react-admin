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
export interface UpdateNewsReq {
  area_id: string;
  c_id: string;
  opt_status: boolean;
  p_c_id: string;
  title: string;
  word_key: string;
}
export enum NewsType {
  AddMedia = '/api/nav/media/add',
  MediaList = '/api/nav/media/list',
  ChangeMediaStatus = '/api/nav/media/opt_status',
  // CreateMedia = '/api/nav/media_content/area/update',
  AddTheasaurus = '/api/nav/media_content/area/add',
  ChangeTheasaurusStatus = '/api/nav/media_content/area/opt_status',
  UpdateNews = '/api/news/update',
  DeleteNews = '/api/news/delete',
  GetTheasaurusList = '/api/nav/media_content/area/list',
  GetCategoryList = '/api/nav/media_content/category/list',
  AddCategory = '/api/nav/media_content/category/add',
  UpdateCategory = '/api/nav/media_content/category/update',
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
  apiClient.get<any>({ url: `/api/nav/media_content/category/del/${category_id}` });
const UpdateCategory = (data: UpdateNewsReq) =>
  apiClient.post<any>({ url: NewsType.UpdateCategory, data });
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
};
