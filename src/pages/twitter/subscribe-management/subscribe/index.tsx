import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    {
      title: '用户名',
      dataIndex: 'author_username',
      key: 'username',
      width: 100,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'author_name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'profile_image_url0',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
    },
    {
      title: '网站名称',
      dataIndex: 'web_site_name',
      key: 'web_site_name',
      width: 100,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile_number',
      key: 'mobile_number',
      width: 150,
      align: 'center',
      render: (text: string) => {
        // 如果不为空
        if (text) {
          return text;
        }
        return '-';
      },
    },
    {
      title: '粉丝数',
      dataIndex: 'followers_count',
      key: 'followers_count',
      width: 150,
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      width: 120,
      align: 'center',
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
