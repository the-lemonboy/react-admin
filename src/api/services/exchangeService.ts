import apiClient from '../apiClient';

export interface NoticeSearchReq {
  content: string;
  date_range: string;
  limit: number;
  page: number;
}
export interface GetRateReq {
  limit: number;
  page: number;
}
export interface GetTickerCxReq {
  limit: number;
  page: number;
}
export interface GetTickerDexReq {
  limit: number;
  page: number;
}
export enum ExchangeApi {
  GetDailyIncrease = '/api/ax/hot-list/day',
  GetMothlyIncrease = '/api/ax/hot-list/month',
  GetWeeklyIncrease = '/api/ax/hot-list/week',
  NoticeSearch = '/api/ax/notice/search',
  GetRate = '/api/ax/premium/list',
  GetTickerCx = '/api/ax/ticker-cex/list',
  GetTickerDex = '/api/ax/ticker-dex/list',
}
const GetDailyIncrease = () => apiClient.get<any>({ url: ExchangeApi.GetDailyIncrease });
const GetMothlyIncrease = () => apiClient.get<any>({ url: ExchangeApi.GetMothlyIncrease });
const GetWeeklyIncrease = () => apiClient.get<any>({ url: ExchangeApi.GetWeeklyIncrease });
const NoticeSearch = (data: NoticeSearchReq) =>
  apiClient.post<any>({ url: ExchangeApi.NoticeSearch, data });
const GetRate = (data: GetRateReq) =>
  apiClient.post<any>({ url: ExchangeApi.GetRate, params: data });
const GetTickerCx = (data: GetTickerCxReq) =>
  apiClient.post<any>({ url: ExchangeApi.GetTickerCx, params: data });
const GetTickerDex = (data: GetTickerDexReq) =>
  apiClient.post<any>({ url: ExchangeApi.GetTickerDex, params: data });
export default {
  GetDailyIncrease,
  GetMothlyIncrease,
  GetWeeklyIncrease,
  NoticeSearch,
  GetRate,
  GetTickerCx,
  GetTickerDex,
};
