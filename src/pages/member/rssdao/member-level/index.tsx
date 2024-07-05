import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Modal, Space, Switch, message, Select } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import navService, { GetMemberListReq, CouponCreateReq } from '@/api/services/member';
import { Iconify, IconButton } from '@/components/icon';
// import OrganizationChart from './organization-chart';

import { MemberTable, ConsumerCard } from '#/entity';
import type { GetProp, TableProps } from 'antd';
// --------------------分页类型
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function MemberLevelPage() {
  const [messageApi, contextHolder] = message.useMessage();
  // -------------分页 table start
  const [query, setQuery] = useState<GetMemberListReq>({ limit: 10, page: 1 });
  const fetchWebsiteList = async (params: GetMemberListReq) => {
    const res = await navService.MemberList(params);
    return res;
  };
  // 使用 useQuery 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ['websiteList', query],
    queryFn: () => fetchWebsiteList(query),
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
    console.log(pagination);
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setQuery({ page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const columns: ColumnsType<MemberTable> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '等级', dataIndex: 'kind', key: 'level' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '价值', dataIndex: 'amount', key: 'amount' },
    { title: '价值(公众号)', dataIndex: 'amount0', key: 'amount0' },
    { title: '支付渠道', dataIndex: 'pay_channel', key: 'pay_channel' },
    { title: '收益率', dataIndex: 'profit_percent', key: 'profit_percent' },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onCreateCoupon(record)}>
            <Iconify icon="ph:tag-fill" size={18} />
          </IconButton>
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
        </div>
      ),
    },
  ];
  // -------------分页 table end
  // ------------新增弹框 start
  const onCreate = () => {};
  // --------------新增弹框 end
  // ---------------分发coupon start
  // 初始化
  const [createCouponProps, setCreateCouponProps] = useState<ConsumerCard>({
    formValue: {
      currency: '',
      price: 0,
      title: '',
      total: 0,
      vip_level_id: '',
      web_site_id: '',
    },
    title: '新增消费卡',
    show: false,
    onOk: () => {
      setCreateCouponProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setCreateCouponProps((prev) => ({ ...prev, show: false }));
    },
  });
  // 新增
  const onCreateCoupon = (record: MemberTable) => {
    setCreateCouponProps((prev) => ({
      ...prev,
      show: true,
      title: '新增消费卡',
      formValue: {
        ...prev.formValue,
      },
    }));
  };
  // ---------------分发coupon end
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card
          title="Website List"
          extra={
            <Button type="primary" onClick={onCreate}>
              新增
            </Button>
          }
        >
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
        <CreateCardModel {...createCouponProps} />
      </Space>
    </>
  );
}

type AddOrAddModelProps = {
  formValue: MemberTable;
  title: String;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  type: string;
  // categoryList: Array<OptionType>;
};

// 新增目录标签
function AddOrAddModel({ title, show, formValue, onOk, onCancel, type }: AddOrAddModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const onStatusChange = (checked: boolean) => {
    if (checked) formValue.opt_status = 1;
    else formValue.opt_status = 0;
  };
  // 新增
  const queryClient = useQueryClient();
  const addCateGoryMutation = useMutation({
    mutationFn: async (params: AddCateGoryReq) => {
      const res = await navService.AddCateGory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoryList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error adding website:', error); // 处理错误
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      addCateGoryMutation.mutate(values); // 提交表单数据进行新增
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<MemberTable> label="种类" name="种类" required>
          <input />
        </Form.Item>
        <Form.Item<MemberTable> label="名称" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<MemberTable> label="名称" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<MemberTable> label="是否禁用" name="opt_status" required>
          <Switch onChange={onStatusChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// 生成消费卡
type CreateCardModelProps = {
  formValue: ConsumerCard;
  title: String;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  // categoryList: Array<OptionType>;
};

// 新增目录标签
function CreateCardModel({ title, show, formValue, onOk, onCancel }: CreateCardModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  // 获取会员等级option
  const { data: VipOption } = useQuery({
    queryKey: ['vip-option'],
    queryFn: async () => {
      const res = await navService.VipLevelOption();
      return res;
    },
  });
  console.log(VipOption);
  const handleVipType = (value: number) => {
    formValue.vip_level_id = value;
  };
  // 新增
  const queryClient = useQueryClient();
  const createCounponMutation = useMutation({
    mutationFn: async (params: CouponCreateReq) => {
      const res = await navService.CouponCreate(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoryList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error adding website:', error); // 处理错误
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      createCounponMutation.mutate(values); // 提交表单数据进行新增
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<ConsumerCard> label="名称" name="title" required>
          <Select
            style={{ width: 120 }}
            onChange={handleVipType}
            options={VipOption.map((option: any) => ({ label: option.title, value: option.id }))}
            value={formValue.vip_level_id}
            // label= {}
          />
        </Form.Item>
        <Form.Item<ConsumerCard> label="价格" name="price" required>
          <Input />
        </Form.Item>
        <Form.Item<ConsumerCard> label="货币" name="currency" required>
          <Input />
        </Form.Item>
        <Form.Item<ConsumerCard> label="站点" name="web_site_id" required>
          <Input />
        </Form.Item>
        <Form.Item<ConsumerCard> label="生成数量" name="vip_level_id" required>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
