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
  category: [
    {
      c_path: string;
      p_c_path: string;
      p_c_path_title: string;
    },
  ];
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
  opt_status: boolean;
  order_n: number;
  others: string;
  pay_channel: string;
  profit_percent: number;
  title: string;
  tweet_total_of_day: number;
  twtter_total: number;
}
export interface UserTable {
  avatar: string;
  created_time: string;
  id: number;
  mobile_number: string;
  name: string;
  suspended: boolean;
  user_type: number;
  vip_id: number;
  web_site_id: string;
  web_site_name: string;
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
export interface WebsiteCategory {
  id: number;
  c_id: string;
  area_id: '';
  word_key: string;
  title: string;
  UpperTitle: string;
  level: number;
  order_n?: number;
  p_c_id: string;
  p_c_path: string;
  opt_status: boolean;
  created_at?: string;
  updated_at?: string;
  del_tag: number;
}
// export interface NewsCategory {
//   area_id: string;
//   c_id: string;
//   has_next: boolean;
//   id: number;
//   level: number;
//   p_c_id: string;
//   p_c_path: string;
//   title: string;
//   upper_title: string;
//   word_key: string;
// }
export interface NewsSearchList {
  created_time: string;
  exchange_media: string;
  exchange_media_title: string;
  id: string;
  news_key: string;
  pub_time: string;
  title: string;
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
export interface PlanetCategory {
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
export interface PlanetKnowledge {
  annotation: string;
  anonymous: boolean;
  answer: string;
  answered: boolean;
  comments: string;
  comments_count: number;
  content_search_text: string;
  content_text: string;
  create_time: string;
  digested: boolean;
  expired: boolean;
  group: {
    background_url: string;
    category: [
      {
        area_id: string;
        c_path: string;
        current: number;
        p_c_path: string;
        p_c_path_title: string;
      },
    ];
    group_id: number;
    name: string;
    type: string;
  };
  id: string;
  images: string;
  index_time: string;
  likes_count: number;
  modify_time: string;
  owner: {
    alias: string;
    avatar_url: string;
    description: string;
    location: string;
    name: string;
    user_id: number;
  };
  readers_count: number;
  reading_count: number;
  rewards_count: number;
  silenced: false;
  sticky: false;
  title: string;
  topic_id: number;
  type: string;
}
export interface TG {
  bot: {
    bot_avatar: string;
    bot_id: string;
    bot_name: string;
  };
  created_at: string; // "2024-04-13 05:59:56"
  group: {
    category: [
      {
        area_id: string;
        c_path: string;
        current: number;
        p_c_path: string;
        p_c_path_title: string;
      },
    ];
    group_avatar: string;
    group_id: string;
    group_name: string;
  };
  group_id: string;
  id: string;
  m_author: string;
  message: {
    file_url: string;
    msg_type: string;
    text: string;
  };
  msg_time: string; // "2024-04-13 05:59:35"
  topic: {
    category: string | null;
    topic_avatar: string;
    topic_id: string;
    topic_name: string;
  };
  topic_id: string;
}

export interface Media {
  id?: number;
  media_key?: string;
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

export interface Tweet {
  id: number;
  tweet_id: string;
  author_id: string;
  name: string;
  username: string;
  profile_image_url0: string;
  text: string;
  lang: string;
  like_count: number;
  reply_count: number;
  retweet_count: number;
  quote_count: number;
  hidden: boolean;
  created_at: string; // This is likely a date string
  created_time: string; // This is also likely a date string
}
interface TweetSessionCategory {
  p_c_path_title: string;
  p_c_path: string;
  area_title: string;
  area_id: string;
}
export interface TweetSessionConv {
  record_id: number;
  conv_id: string;
  tweet_id: string;
  author_id: string;
  name: string;
  username: string;
  profile_image_url0: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  text: string;
  lang: string;
  like_count: number;
  reply_count: number;
  retweet_count: number;
  quote_count: number;
  created_at: string;
  category: TweetSessionCategory[];
}

export interface TwitterUser {
  id: number; // 用户ID
  author_id: string; // 作者ID
  name: string; // 用户名称
  username: string; // 用户名
  username_key: string; // 用户名的密钥
  created_at: string; // 创建时间
  location: string; // 位置
  profile_image_url: string; // 头像URL
  profile_image_url0: string; // 备用头像URL
  description: string; // 用户描述
  url: string; // 个人主页链接
  followers_count: number; // 粉丝数
  following_count: number; // 关注数
  tweet_count: number; // 推文数
  listed_count: number; // 列表数
  created_time: string; // 数据创建时间
  updated_time: string; // 数据更新时间
  verified: boolean; // 是否已验证
  hidden: boolean; // 是否隐藏
  categories: string[] | null; // 用户分类，可以为空
}

export interface TweetCount {
  id: number;
  author_id: string;
  name: string;
  username: string;
  username_key: string;
  created_at: string;
  location: string;
  profile_image_url: string;
  profile_image_url0: string;
  description: string;
  url: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  created_time: string;
  updated_time: string;
  verified: boolean;
  categories: string[] | null;
}
