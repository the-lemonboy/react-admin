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
  author_id: string;
}
// interface Item {
//   area_id: string;
//   p_c_id: string;
// }
export interface GetChildCateGoryReq {
  area_id: string;
  p_c_id: string;
  level: number;
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
export interface GetUserListReq {
  limit: number;
  mobile_number?: string;
  name?: string;
  page: number;
  suspended?: string;
  web_site_id?: string;
}
export interface BandUserReq {
  id: number;
  suspended: boolean;
}
export interface GetSessionListReq {
  area_id?: string;
  author?: string;
  content?: string;
  created_at_range?: string;
  like_count?: number;
  limit: number;
  p_c_paths?: string[];
  page: number;
  reply_count?: number;
  retweet_count?: number;
  username?: string;
}
export interface DelSessionReq {
  tweet_ids: string[];
}
export interface SetSessionStatusReq {
  hidden: boolean;
  tweet_ids: string[];
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
  SetCategroyTags = '/api/twitter/author/category_setting',
  GetChildCateGory = '/api/twitter/author/level/cat/list',
  // GetGroupList = '/api/twitter/zxsq/group_list',

  // ----推文内容
  GetArticleList = '/api/twitter/tweet/list',
  SetArticlesStatus = '/api/twitter/tweet/hidden',
  DelArticles = '/api/twitter/tweet/delete',
  // ----账号管理
  GetAcountList = '/api/twitter/author/list',

  // 用户管理
  GetUserList = '/api/user/list',
  BandUser = '/api/user/suspended',

  // ----会话管理
  GetSessionList = '/api/twitter/conv/tweet/list',
  DelSession = '/api/twitter/tweet/delete',
  SetSessionStatus = '/api/twitter/tweet/hidden',
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
const GetCateGoryTagList = (author_id: string) =>
  apiClient.get({ url: `/api/twitter/author/${author_id}/categories` });
const DelCateGoryTag = (c_id: string) => apiClient.get({ url: `/api/twitter/categor/del/${c_id}` });
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
const GetUserList = (data: GetUserListReq) => apiClient.post({ url: PlanetType.GetUserList, data });
const GetUserDetail = (uid: string) => apiClient.get({ url: `/api/user/detail/${uid}` });
const BandUser = (data: BandUserReq) => apiClient.post({ url: PlanetType.BandUser, data });

const GetSessionList = (data: GetSessionListReq) =>
  apiClient.post({ url: PlanetType.GetSessionList, data });
const DelSession = (data: DelSessionReq) => apiClient.post({ url: PlanetType.DelSession, data });
const SetSessionStatus = (data: SetSessionStatusReq) =>
  apiClient.post({ url: PlanetType.SetSessionStatus, data });
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
  GetUserList,
  BandUser,
  GetUserDetail,
  GetSessionList,
  DelSession,
  SetSessionStatus,
};
