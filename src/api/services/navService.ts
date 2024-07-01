import apiClient from '../apiClient';

export interface GetWebsiteListRes {
  limit: number;
  page: number;
}
export interface AddCateGoryReq {
  opt_status: number;
  p_c_id: string;
  title: string;
}
export interface DelCateGoryReq {
  cid: string;
}
export interface CateGoryListReq {
  level: number;
  p_c_id: string;
}
export interface OptCateGoryReq {
  cid: number;
  opt: Boolean;
}
export interface AddTagReq {
  cids: Array<string>;
  url: string;
}
export interface DelTagReq {
  cid: string;
  wid: string;
}
// export interface getTagListReq {
//   cid: string;
// }
export interface SearchWebsiteReq {
  description: String;
  limit: number;
  p_c_path: String;
  page: number;
  title: String;
}
export interface GetWebsiteListReq {
  cid: string;
}
export interface AddWebsiteReq {
  description: string;
  icon: string;
  link: string;
  title: string;
}
export interface DelWebSiteReq {
  wid: string;
}
export enum NavType {
  WebsiteLits = '/api/nav/website/list',
  AddCateGory = '/api/nav/category/add',
  DelCateGory = '/api/nav/category/del',
  CateGoryList = '/api/nav/category/list',
  OptCateGory = '/api/nav/category/set/opt',
  AddTag = '/api/nav/website/category/add',
  DelTag = '/api/nav/website/category/del',
  GetTagList = '/api/nav/website/category/list',
  SearchWebsite = '/api/nav/website/search',
  GtWebsiteList = '/api/nav/website/list',
  AddWebsite = '/api/nav/website/add',
  DelWebSite = '/api/nav/website/del',
  EditorWebsite = '/api/nav/website/edit',
}
const WebsiteList = (data: GetWebsiteListRes) =>
  apiClient.post<GetWebsiteListRes>({ url: NavType.WebsiteLits, data });
const AddCateGory = (data: AddCateGoryReq) =>
  apiClient.post<any>({ url: NavType.AddCateGory, data });
const DelCateGory = (data: DelCateGoryReq) =>
  apiClient.post<any>({ url: NavType.DelCateGory, data });
const CateGoryList = () => apiClient.get<any>({ url: NavType.CateGoryList });
const OptCateGory = (data: AddCateGoryReq) =>
  apiClient.post<any>({ url: NavType.OptCateGory, data });
const AddTag = (data: AddTagReq) => apiClient.post<any>({ url: NavType.AddTag, data });
const DelTag = (data: DelTagReq) => apiClient.post<any>({ url: NavType.DelTag, data });
const SearchWebsite = (data: SearchWebsiteReq) =>
  apiClient.post<any>({ url: NavType.SearchWebsite, data });
const AddWebsite = (data: AddWebsiteReq) => apiClient.post<any>({ url: NavType.AddWebsite, data });
const DelWebSite = (data: DelWebSiteReq) => apiClient.post<any>({ url: NavType.DelWebSite, data });
const EditorWebsite = (data: AddWebsiteReq) =>
  apiClient.post<any>({ url: NavType.EditorWebsite, data });
export default {
  WebsiteList,
  AddCateGory,
  DelCateGory,
  CateGoryList,
  OptCateGory,
  AddTag,
  DelTag,
  // getTagList,
  SearchWebsite,
  AddWebsite,
  DelWebSite,
  EditorWebsite,
  // GetWebsiteList,
};
