import { useQuery } from '@tanstack/react-query';
import { Card, Space, message, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import newsService from '@/api/services/newsService';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function MediaManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<GetCouponListReq>({ limit: 10, page: 1 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['mediaList', query],
    queryFn: () => newsService.GetMediaList(query),
  });
  console.log(tableList);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
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
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setQuery({ page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const columns: ColumnsType<{ mediaTableType }> = [
    { title: 'ID', dataIndex: 'media_key', key: 'media_key' },
    { title: '名称', dataIndex: 'media_title', key: 'media_title' },
    {
      title: '分发状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_: any, record: any) => (
        <Switch
          checkedChildren="已分发"
          unCheckedChildren="未分发"
          defaultChecked={record.distributed}
          onChange={(checked) => onChanheCouponStatus(checked, record)}
        />
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card title="媒体管理">
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
