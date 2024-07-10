import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import couponService, {
  GetCouponListReq,
  ChangeCouponStatusReq,
} from '@/api/services/couponService';

import AddInfoModel from './addInfoModel';

// import OrganizationChart from './organization-chart';
import { CouponTableType } from '#/entity';
import type { GetProp, TableProps } from 'antd';
// --------------------分页类型
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function MemberLevelPage() {
  const [messageApi, contextHolder] = message.useMessage();
  // -------------分页 table start
  const [query, setQuery] = useState<GetCouponListReq>({ limit: 10, page: 1 });
  const fetchCouponList = async (params: GetCouponListReq) => {
    const res = await couponService.GetCouponList(params);
    return res;
  };
  // 使用 useQuery 获取数据
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['couponList', query],
    queryFn: () => fetchCouponList(query),
  });
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: data?.count,
    },
  });
  useEffect(() => {
    if (data) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: data?.count, // 确保 data.count 是正确的总数值
        },
      }));
    }
  }, [data]);
  const handleTableChange: TableProps['onChange'] = (pagination) => {
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setQuery({ page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  // 修改分发状态
  const queryClient = useQueryClient();
  const changeDistributedMutation = useMutation({
    mutationFn: async (params: ChangeCouponStatusReq) => {
      const res = await couponService.ChangeCouponStatus(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['couponList']);
      messageApi.success('修改成功');
    },
    onError: (err: any) => {
      refetch();
      messageApi.error(err.message);
    },
  });
  const [addInfoModelProps, setAddInfoModelProps] = useState({
    title: '发放卡券',
    show: false,
    formValue: {},
    onOk: () => {
      setAddInfoModelProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setAddInfoModelProps((prev) => ({ ...prev, show: false }));
    },
  });
  const onChanheCouponStatus = (checked: boolean, record: CouponTableType) => {
    if (record.mobile_number && record.c_no) {
      changeDistributedMutation.mutate({
        account: record.mobile_number,
        c_no: record.c_no,
        distributed: checked,
      });
    } else {
      setAddInfoModelProps((prev) => ({
        ...prev,
        show: true,
        formValue: {
          distributed: checked,
          c_no: record.c_no,
          account: record.mobile_number,
        },
      }));
    }
  };
  // 这里可以加入更新状态的逻辑，例如调用 API 更新状态
  const columns: ColumnsType<CouponTableType> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '卡号', dataIndex: 'c_no', key: 'c_no' },
    {
      title: '价值',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => `${record.price}${record.currency}`,
    },
    {
      title: '种类',
      dataIndex: 'vip_level_name',
      key: 'vip_level_name',
    },
    { title: '手机号', dataIndex: 'mobile_number', key: 'mobile_number' },
    {
      title: '分发状态',
      dataIndex: 'distributed',
      key: 'distributed',
      render: (_: any, record: any) => (
        <Switch
          checkedChildren="已分发"
          unCheckedChildren="未分发"
          defaultChecked={record.distributed}
          onChange={(checked) => onChanheCouponStatus(checked, record)}
        />
      ),
    },

    { title: '使用渠道', dataIndex: 'pay_channel', key: 'pay_channel' },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 100 },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    { title: '过期时间', dataIndex: 'expired_at', key: 'expired_at' },
  ];
  // -------------分页 table end
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card title="消费卡分发">
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content' }}
            columns={columns}
            dataSource={data?.data}
            pagination={tableParams.pagination}
            // rowSelection={{ ...rowSelection }}
            loading={isLoading}
            onChange={handleTableChange}
          />
        </Card>
        <AddInfoModel {...addInfoModelProps} />
      </Space>
    </>
  );
}
