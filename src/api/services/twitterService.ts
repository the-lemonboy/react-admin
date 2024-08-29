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
export interface GetGroupListReq {
  limit: number;
  page: number;
}
export interface GetArticleReq {
  limit: number;
  page: number;
}
export interface SetArticlesStatusReq {
  hidden: boolean;
  tweet_ids: string[];
}
export interface DelArticlesReq {
  tweet_ids: string[];
}
export interface GetAcountListReq {
  area_id?: string;
  limit: number;
  name?: string;
  p_c_path?: string;
  page: number;
  username?: string;
}
export enum PlanetType {
  AddArea = '/api/twitter/area/add',
  GetAreaList = '/api/twitter/area/list',
  ChangeAreaStatus = '/api/twitter/area/opt_status',
  UpdateArea = '/api/twitter/area/update',
  AddCateGory = '/api/twitter/category/add',
  ChangeCategoryStatus = '/api/twitter/category/opt_status',
  GetCategoryList = '/api/twitter/category/list',
  UpdateCategory = '/api/twitter/category/update',
  SearchKnowledge = '/api/twitter/zsxq/topic/topic_search',
  SetCategroyTags = '/api/twitter/tg/topic/category_setting',
  GetChildCateGory = '/api/twitter/category/level',
  // GetGroupList = '/api/twitter/zxsq/group_list',

  // ----推文内容
  GetArticleList = '/api/twitter/tweet/list',
  SetArticlesStatus = '/api/twitter/tweet/hidden',
  DelArticles = '/api/twitter/tweet/delete',
  // ----账号管理
  GetAcountList = '/api/twitter/author/list',
}

const AddArea = (data: AddAreaReq) => apiClient.post({ url: PlanetType.AddArea, data });
const GetAreaList = () => apiClient.get({ url: PlanetType.GetAreaList });
const ChangeAreaStatus = (data: ChangeAreaStatusReq) =>
  apiClient.post({ url: PlanetType.ChangeAreaStatus, data });
const UpdateArea = (data: AddAreaReq) => apiClient.post({ url: PlanetType.UpdateArea, data });
const GetArea = (id: string) => apiClient.get({ url: `/api/navigator/area/${id}` });
const AddCateGory = (data: AddCategoryReq) => apiClient.post({ url: PlanetType.AddCateGory, data });
const ChangeCategoryStatus = (data: ChangeCategoryStatusReq) =>
  apiClient.post({ url: PlanetType.ChangeCategoryStatus, data });
const DelCateGory = (id: string) => apiClient.get({ url: `/api/navigator/category/del/${id}` });
const GetCategoryList = (data: GetCategoryListReq) =>
  apiClient.post({ url: PlanetType.GetCategoryList, data });
const UpdateCategory = (data: UpdateCategoryReq) =>
  apiClient.post({ url: PlanetType.UpdateCategory, data });
const SetCategroyTags = (data: SetCategroyTagsReq) =>
  apiClient.post({ url: PlanetType.SetCategroyTags, data });
const SearchKnowledge = (data: SearchKnowledgeReq) =>
  apiClient.post({ url: PlanetType.SearchKnowledge, data });
const GetCateGoryTagList = (group_id: string) =>
  apiClient.get({ url: `/api/navigator/zxsq/group/${group_id}/categories` });
const DelCateGoryTag = (group_id: string, category_id: string) =>
  apiClient.get({ url: `/api/navigator/zxsq/group/${group_id}/del_category/${category_id}` });
const GetChildCateGory = (data: GetChildCateGoryReq) =>
  apiClient.post({ url: PlanetType.GetChildCateGory, data });
const GetArticleList = (data: GetArticleReq) =>
  apiClient.post({ url: PlanetType.GetArticleList, data });
const SetArticlesStatus = (data: SetArticlesStatusReq) =>
  apiClient.post({ url: PlanetType.SetArticlesStatus, data });
const DelArticles = (data: DelArticlesReq) => apiClient.post({ url: PlanetType.DelArticles, data });
const GetAcountList = (data: GetAcountListReq) =>
  apiClient.post({ url: PlanetType.GetAcountList, data });
const GetAcountDetail = (id: string) => apiClient.get({ url: `/api/twitter/author/${id}` });
const GetAcountDetailHashTag = (id: string) =>
  apiClient.get({ url: `/api/twitter/author/hashtags/${id}` });
// const GetGroupList = (data: GetGroupListReq) =>
//   apiClient.post({ url: PlanetType.GetGroupList, data });
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
  SetCategroyTags,
  SearchKnowledge,
  GetCateGoryTagList,
  DelCateGoryTag,
  GetChildCateGory,
  GetArticleList,
  // GetGroupList,
  SetArticlesStatus,
  DelArticles,
  GetAcountList,
  GetAcountDetail,
  GetAcountDetailHashTag,
};