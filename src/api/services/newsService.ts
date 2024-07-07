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
export enum NewsType {
  NewsList = '/api/nav/media/news/list',
  CreateNews = '/api/news/create',
  UpdateNews = '/api/news/update',
  DeleteNews = '/api/news/delete',
}

const GetMediaList = (data: GetMediaListReq) =>
  apiClient.post<any>({ url: NewsType.NewsList, data });

export default {
  GetMediaList,
};
