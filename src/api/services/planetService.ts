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
export interface SearchKnowledgeReq {
  area_id?: string;
  author?: string;
  comment_count_max?: number;
  comment_count_min?: number;
  content?: string;
  context_annotation?: string;
  created_at_range?: string;
  group_id?: string;
  keyword?: string[];
  like_count_max?: number;
  like_count_min?: number;
  limit: number;
  p_c_path?: string;
  page: number;
  read_count_max?: number;
  read_count_min?: number;
  topic_id?: string;
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
}
export interface GetChildCateGoryReq {
  area_id: string;
  level: number;
  p_c_id: string;
}
export enum PlanetType {
  AddArea = '/api/nav/navigator/area/add',
  GetAreaList = '/api/nav/navigator/area/list',
  ChangeAreaStatus = '/api/nav/navigator/area/opt_status',
  UpDateArea = '/api/nav/navigator/area/update',
  AddCateGory = '/api/nav/navigator/category/add',
  ChangeCategoryStatus = '/api/nav/navigator/category/opt_status',
  GetCategoryList = '/api/nav/navigator/category/list',
  UpdateCategory = '/api/nav/navigator/category/update',
  SearchKnowledge = '/api/nav/navigator/zsxq/topic/topic_search',
  SetCategroyTags = '/api/nav/navigator/tg/topic/category_setting',
  GetChildCateGory = '/api/nav/navigator/category/level',
}

const AddArea = (data: AddAreaReq) => apiClient.post({ url: PlanetType.AddArea, data });
const GetAreaList = () => apiClient.get({ url: PlanetType.GetAreaList });
const ChangeAreaStatus = (data: ChangeAreaStatusReq) =>
  apiClient.post({ url: PlanetType.ChangeAreaStatus, data });
const UpDateArea = (data: AddAreaReq) => apiClient.post({ url: PlanetType.UpDateArea, data });
const GetArea = (id: string) => apiClient.get({ url: `/api/nav/navigator/area/${id}` });
const AddCateGory = (data: AddCategoryReq) => apiClient.post({ url: PlanetType.AddCateGory, data });
const ChangeCategoryStatus = (data: ChangeCategoryStatusReq) =>
  apiClient.post({ url: PlanetType.ChangeCategoryStatus, data });
const DelCateGory = (id: string) => apiClient.get({ url: `/api/nav/navigator/category/del/${id}` });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post({ url: PlanetType.GetCategoryList, data });
const UpdateCategory = (data: UpdateCategoryReq) =>
  apiClient.post({ url: PlanetType.UpdateCategory, data });
const SetCategroyTags = (data: SetCategroyTagsReq) =>
  apiClient.post({ url: PlanetType.SetCategroyTags, data });
const SearchKnowledge = (data: SearchKnowledgeReq) =>
  apiClient.post({ url: PlanetType.SearchKnowledge, data });
const GetCateGoryTagList = (group_id: string) =>
  apiClient.get({ url: `/api/nav/navigator/zxsq/group/${group_id}/categories` });
const DelCateGoryTag = (group_id: string, category_id: string) =>
  apiClient.get({ url: `/api/nav/navigator/zxsq/group/${group_id}/del_category/${category_id}` });
const GetChildCateGory = (data: GetChildCateGoryReq) =>
  apiClient.post({ url: PlanetType.GetChildCateGory, data });
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
  ChangeCategoryStatus,
  SetCategroyTags,
  SearchKnowledge,
  GetCateGoryTagList,
  DelCateGoryTag,
  GetChildCateGory,
};