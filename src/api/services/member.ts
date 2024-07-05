import apiClient from '../apiClient';

export interface GetMemberListReq {
  limit: number;
  page: number;
}
export interface CouponCreateReq {
  currency: string;
  price: number;
  title: string;
  total: number;
  vip_level_id: number;
  web_site_id: string;
}
export enum MemberType {
  MemberList = '/api/nav/vip/level/list',
  CouponCreate = '/api/nav/vip/coupon/generate',
  VipLevelOption = '/api/nav/vip/level/options'
}
const MemberList = (data: GetMemberListReq) =>
  apiClient.post<any>({ url: MemberType.MemberList, data });
const CouponCreate = (data: CouponCreateReq) =>
  apiClient.post<any>({ url: MemberType.CouponCreate, data });
const VipLevelOption = () => apiClient.get<any>({ url: MemberType.VipLevelOption });
export default {
  MemberList,
  CouponCreate,
  VipLevelOption,
};
