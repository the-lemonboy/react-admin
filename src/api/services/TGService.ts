import apiClient from '../apiClient';

export interface AddAreaReq {
  area_key?: string;
  id?: string;
  is_search_key?: boolean;
  opt_status: boolean;
  title: string;
}
export interface ChangeAreaStatusReq {
  id: string;
  opt_status: boolean;
}
export interface AddCategoryReq {
  area_id: string;
  c_id: string;
  opt_status: boolean;
  p_c_id: string;
  title: string;
  word_key: string;
}
export interface GetCategoryListReq {
  area_id: string;
}
export interface UpdateCategoryReq {
  area_id: string;
  c_id: string;
  opt_status: boolean;
  p_c_id: string;
  title: string;
  word_key: string;
}
export enum TGType {
  AddArea = '/api/nav/navigator/tg/area/add',
  GetAreaList = '/api/nav/navigator/tg/area/list',
  ChangeAreaStatus = '/api/nav/navigator/tg/area/opt_status',
  UpDateArea = '/api/nav/navigator/tg/area/update',
  AddCateGory = '/api/nav/navigator/tg/category/add',
  GetCategoryList = '/api/nav/navigator/tg/category/list',
  UpdateCategory = '/api/nav/navigator/tg/category/update',
}
const AddArea = (data: AddAreaReq) => apiClient.post({ url: TGType.AddArea, data });
const GetAreaList = () => apiClient.get({ url: TGType.GetAreaList });
const ChangeAreaStatus = (data: ChangeAreaStatusReq) =>
  apiClient.post({ url: TGType.ChangeAreaStatus, data });
const UpDateArea = (data: AddAreaReq) => apiClient.post({ url: TGType.UpDateArea, data });
const GetArea = (id: string) => apiClient.get({ url: `/api/nav/navigator/tg/area/${id}` });
const AddCateGory = (data: AddCategoryReq) => apiClient.post({ url: TGType.AddCateGory, data });
const DelCateGory = (id: string) =>
  apiClient.get({ url: `/api/nav/navigator/tg/category/del/${id}` });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post({ url: TGType.GetCategoryList, data });
const UpdateCategory = (data: UpdateCategoryReq) =>
  apiClient.post({ url: TGType.UpdateCategory, data });
export default {
  AddArea,
  GetAreaList,
  ChangeAreaStatus,
  UpDateArea,
  GetArea,
  AddCateGory,
  DelCateGory,
  GetCategoryList,
  UpdateCategory,
};
