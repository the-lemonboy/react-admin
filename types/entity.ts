import { BasicStatus, PermissionType } from './enum';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  role?: Role;
  status?: BasicStatus;
  permissions?: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  status: 'enable' | 'disable';
  desc?: string;
  order?: number;
  children?: Organization[];
}
export interface Website {
  hash_key: string;
  id?: string;
  description: string;
  icon: string;
  link: string;
  title: string;
}
export interface MemberTable {
  amount: number; // 价格
  amount0: number; // 微信端价格
  created_at: string;
  currency: string;
  currency0: string;
  description: string;
  description0: string; // 微信端描述
  id: number;
  kind: number;
  opt_status: true;
  order_n: number;
  others: string;
  pay_channel: string;
  profit_percent: number;
  title: string;
  tweet_total_of_day: number;
  twtter_total: number;
}
export interface CouponTableType {
  id: number;
  c_no: string;
  vip_level_id: number;
  vip_level_name: string;
  kind: number;
  price: number;
  currency: string;
  binding_status: number;
  distributed: boolean;
  remark: string;
  bonded_at: string;
  expired_at: string;
  dist_to_u_id: number;
  mobile_number: string;
}
export interface ConsumerCard {
  currency: string;
  price: number;
  title: string;
  total: number;
  vip_level_id: number;
  web_site_id: string;
}
export interface Theasaurus {
  id: string;
  title: string;
  area_key: string;
  word_key: string;
  created_at: string;
  updated_at: string;
  opt_status: boolean;
}
export interface NewsCategory {
  c_id: string;
  area_id: string;
  area_title: string;
  word_key: string;
  title: string;
  upper_title: string;
  level: number;
  order_n: number;
  p_c_id: number;
  p_c_path: string;
  opt_status: boolean;
  created_at: string;
  updated_at: string;
}
export interface MediaTableType {
  id: number;
  media_key: string;
  media_title: string;
  opt_status: boolean;
}
export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[];
}
