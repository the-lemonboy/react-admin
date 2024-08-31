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
export interface ChangeCategoryStatusReq {
  c_id: string;
  opt_status: boolean;
}
interface CategoryPath {
  area_id: string;
  c_id: string;
  p_c_path: string;
}

export interface SetCategroyTagsReq {
  category_paths: CategoryPath[];
  group_id: string;
  topic_id: string;
}
export interface SearchTGReq {
  area_id?: string;
  author?: string;
  content?: string;
  created_at_range?: string;
  group_id?: string;
  keyword?: string[];
  limit: number;
  message_id?: string;
  msg_type?: string;
  p_c_path?: string;
  page: number;
  topic_id?: string;
}
export interface GetChildCateGoryReq {
  area_id: string;
  level: number;
  p_c_id: string;
}
export interface GetGroupListReq {
  page: number;
  limit: number;
}
export enum TGType {
  AddArea = '/api/navigator/tg/area/add',
  GetAreaList = '/api/navigator/tg/area/list',
  ChangeAreaStatus = '/api/navigator/tg/area/opt_status',
  UpdateArea = '/api/navigator/tg/area/update',
  AddCateGory = '/api/navigator/tg/category/add',
  GetCategoryList = '/api/navigator/tg/category/list',
  UpdateCategory = '/api/navigator/tg/category/update',
  ChangeCategoryStatus = '/api/navigator/tg/category/opt_status',
  SearchTG = '/api/navigator/tg/message/message_search',
  SetCategroyTags = '/api/navigator/tg/topic/category_setting',
  GetChildCateGory = '/api/navigator/tg/category/level',
  GetGroupList = '/api/navigator/tg/topic/list',
}
const AddArea = (data: AddAreaReq) => apiClient.post({ url: TGType.AddArea, data });
const GetAreaList = () => apiClient.get({ url: TGType.GetAreaList });
const ChangeAreaStatus = (data: ChangeAreaStatusReq) =>
  apiClient.post({ url: TGType.ChangeAreaStatus, data });
const UpdateArea = (data: AddAreaReq) => apiClient.post({ url: TGType.UpdateArea, data });
const GetArea = (id: string) => apiClient.get({ url: `/api/navigator/tg/area/${id}` });
const AddCateGory = (data: AddCategoryReq) => apiClient.post({ url: TGType.AddCateGory, data });
const DelCateGory = (id: string) => apiClient.get({ url: `/api/navigator/tg/category/del/${id}` });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post({ url: TGType.GetCategoryList, data });
const UpdateCategory = (data: UpdateCategoryReq) =>
  apiClient.post({ url: TGType.UpdateCategory, data });
const ChangeCategoryStatus = (data: ChangeCategoryStatusReq) =>
  apiClient.post({ url: TGType.ChangeCategoryStatus, data });
const SearchTG = (data: SearchTGReq) => apiClient.post({ url: TGType.SearchTG, data });
const SetCategroyTags = (data: CategoryPath) =>
  apiClient.post({ url: TGType.SetCategroyTags, data });
const GetChildCateGory = (data: GetChildCateGoryReq) =>
  apiClient.post({ url: TGType.GetChildCateGory, data });
const GetGroupList = (data: GetGroupListReq) => apiClient.post({ url: TGType.GetGroupList, data });
const GetCateGoryTagList = (group_id: string) =>
  apiClient.get({ url: `/api/navigator/tg/${group_id}/topic/categories` });
const DelCateGoryTag = (category_id: string) =>
  apiClient.get({ url: `/api/navigator/tg/category/del/${category_id}` });
export default {
  AddArea,
  GetAreaList,
  ChangeAreaStatus,
  UpdateArea,
  GetArea,
  AddCateGory,
  DelCateGory,
  GetCategoryList,
  UpdateCategory,
  ChangeCategoryStatus,
  SearchTG,
  SetCategroyTags,
  GetChildCateGory,
  GetGroupList,
  GetCateGoryTagList,
  DelCateGoryTag,
};
