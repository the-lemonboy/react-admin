import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import twitterService, { GetSubscribeListReq } from '@/api/services/twitterService';

import { TwitterUser } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function KnowledgeGrounp() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [subscribeQuery, setSubscribeQuery] = useState<GetSubscribeListReq>({
    limit: 20,
    page: 1,
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['SubscribeList', subscribeQuery],
    queryFn: () => twitterService.GetSubscribeList(subscribeQuery),
  });
  // 分页
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
      total: tableList?.count,
    },
  });
  useEffect(() => {
    if (tableList) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: tableList?.count, // 确保 data.count 是正确的总数值
        },
      }));
    }
  }, [tableList]);
  const handleTableChange: TableProps['onChange'] = (pagination) => {
    console.log(pagination);
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 20;
    setSubscribeQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setSubscribeQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
      setTableParams({ pagination });
    }
  };
  const columns: ColumnsType<TwitterUser> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    // {
    //   title: '头像',
    //   dataIndex: 'avatar',
    //   key: 'profile_image_url0',
    //   align: 'center',
    //   width: 80,
    //   render: (text: string) => (
    //     <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
    //   ),
    // },
    {
      title: '推特账号名称',
      dataIndex: 'author_name',
      key: 'author_name',
      width: 200,
      align: 'center',
    },
    {
      title: '推特账号ID',
      dataIndex: 'author_username',
      key: 'author_username',
      width: 200,
      align: 'center',
      render: (_, record: any) => (
        // 跳转https://x.com/trondao
        <a
          href={`https://x.com/${record.author_username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {record.author_username}
        </a>
      ),
    },
    // {
    //   title: '手机号',
    //   dataIndex: 'mobile_number',
    //   key: 'mobile_number',
    //   width: 150,
    //   align: 'center',
    //   render: (text: string) => {
    //     // 如果不为空
    //     if (text) {
    //       return text;
    //     }
    //     return '-';
    //   },
    // },

    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      width: 200,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'sign',
      key: 'sign',
      width: 200,
      align: 'center',
    },
    {
      title: '推特评分',
      dataIndex: 'twitter_score',
      key: 'twitter_score',
      width: 200,
      align: 'center',
    },
    {
      title: '简介',
      dataIndex: 'profile',
      key: 'profile',
      width: 200,
      align: 'center',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 200,
      align: 'center',
    },
    {
      title: '超链接',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '注册时间',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '推特主页链接',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '推特账号类型',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '关注数',
      dataIndex: 'following_count',
      key: 'following_count',
      width: 150,
      align: 'center',
    },
    {
      title: '粉丝数',
      dataIndex: 'followers_count',
      key: 'followers_count',
      width: 150,
      align: 'center',
    },
    {
      title: '置顶推文链接',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '置顶推文内容',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button className="mr-2" type="primary" onClick={() => onDel(record)}>
            删除
          </Button>
        </div>
      ),
    },
  ];
  const delTiwtterAccount = useMutation({
    mutationFn: async (id: string) => {
      const res = await twitterService.DelSubscribe(id);
      return res.data;
    },
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries(['SubscribeList']);
    },
    onError: (error) => {
      message.error('删除失败');
    },
  });
  const onDel = (record: TwitterUser) => {
    delTiwtterAccount.mutate(record.id.toString());
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card title="推特订阅管理">
          <Table
            scroll={{ x: '1500' }}
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
      </Space>
    </>
  );
}
