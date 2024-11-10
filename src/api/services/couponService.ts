import apiClient from '../apiClient';

export interface GetCouponListReq {
  limit: number;
  page: number;
  binding_status?: number;
  c_no?: string;
  distributed?: string;
  mobile_number?: string;
  vip_level_id?: number;
}
export interface ChangeCouponStatusReq {
  account: string;
  c_no: string;
  distributed: boolean;
}
export interface ChangeRemarkReq {
  c_no: string;
  remark: string;
}
export enum CouponType {
  GetCouponList = '/api/vip/coupon/list',
  ChangeCouponStatus = '/api/vip/coupon/distribute',
  ChangeRemark = '/api/vip/coupon/update_remark',
}
const GetCouponList = (data: GetCouponListReq) =>
  apiClient.post<any>({ url: CouponType.GetCouponList, data });
const ChangeCouponStatus = (data: ChangeCouponStatusReq) =>
  apiClient.post<any>({ url: CouponType.ChangeCouponStatus, data });
const getUserInfo = (uid: string) => apiClient.get<any>({ url: `/api/nav/user/detail/${uid}` });
const ChangeRemark = (data: ChangeRemarkReq) =>
  apiClient.post<any>({ url: CouponType.ChangeRemark, data });
export default {
  GetCouponList,
  ChangeCouponStatus,
  getUserInfo,
  ChangeRemark,
};
