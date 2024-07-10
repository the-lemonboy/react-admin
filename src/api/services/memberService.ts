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
export interface AddVipLevelReq {
  amount: number;
  amount0: number;
  currency: string;
  currency0: string;
  description: string;
  description0: string;
  kind: number;
  others: string;
  pay_channel: string;
  profit_percent: number;
  title: string;
  tweet_total_of_day: number;
  twtter_total: number;
}
export interface GetUserListReq {
  limit: number;
  mobile_number?: string;
  name?: string;
  page: number;
  suspended?: string;
  web_site_id?: string;
}
export interface SuspendedUserReq {
  id: number;
  suspended: boolean;
}
export interface ChangeVipLevelStatusReq {
  id: number;
  opt_status: boolean;
}
export enum MemberType {
  MemberList = '/api/nav/vip/level/list',
  CouponCreate = '/api/nav/vip/coupon/generate',
  VipLevelOption = '/api/nav/vip/level/options',
  AddVipLevel = '/api/nav/vip/level/add',
  GetUserList = '/api/nav/user/list',
  suspendedUser = '/api/nav/user/suspended',
  ChangeVipLevelStatus = '/api/nav/vip/level/opt_status',
  // EditVipLevel = '/api/nav/vip/level/edit',
}
const MemberList = (data: GetMemberListReq) =>
  apiClient.post<any>({ url: MemberType.MemberList, data });
const CouponCreate = (data: CouponCreateReq) =>
  apiClient.post<any>({ url: MemberType.CouponCreate, data });
const VipLevelOption = () => apiClient.get<any>({ url: MemberType.VipLevelOption });
const AddVipLevel = (data: AddVipLevelReq) =>
  apiClient.post<any>({ url: MemberType.AddVipLevel, data });
const GetVipLevel = (level_id: string) =>
  apiClient.get<any>({ url: `/api/nav/vip/level/${level_id}` });
const EditVipLevel = (levelId: number, data: AddVipLevelReq) =>
  apiClient.post<any>({ url: `/api/nav/vip/level/${levelId}/edit`, data });
const GetUserList = (data: GetUserListReq) =>
  apiClient.post<any>({ url: MemberType.GetUserList, data });
const SuspendedUser = (data: SuspendedUserReq) =>
  apiClient.post<any>({ url: MemberType.suspendedUser, data });
const ChangeVipLevelStatus = (data: ChangeVipLevelStatusReq) =>
  apiClient.post<any>({
    url: MemberType.ChangeVipLevelStatus,
    data,
  });
export default {
  MemberList,
  CouponCreate,
  VipLevelOption,
  AddVipLevel,
  GetVipLevel,
  EditVipLevel,
  GetUserList,
  SuspendedUser,
  ChangeVipLevelStatus,
};
