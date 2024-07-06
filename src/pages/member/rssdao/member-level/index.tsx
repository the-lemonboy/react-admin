import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Modal, Space, message, Select, Radio, InputNumber } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import navService, { GetMemberListReq, CouponCreateReq } from '@/api/services/member';
// import OrganizationChart from './organization-chart';

import { MemberTable, ConsumerCard } from '#/entity';
import type { GetProp, TableProps, RadioChangeEvent } from 'antd';
// --------------------分页类型
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
const { TextArea } = Input;
const VipOption = [
  {
    id: 0,
    title: '年卡',
  },
  {
    id: 1,
    title: '月卡',
  },
  {
    id: 2,
    title: '合伙人',
  },
  {
    id: 3,
    title: '股东',
  },
  {
    id: -1,
    title: '普通会员',
  },
  {
    id: -2,
    title: '终身会员',
  },
];
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
    queryKey: ['memberList', query],
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
    {
      title: '等级',
      dataIndex: 'kind',
      key: 'level',
      render: (_, record) => {
        const vip = VipOption?.find((item) => item.id === record.kind);
        return vip ? vip.title : '未知等级';
      },
    },
    { title: '描述', dataIndex: 'description', key: 'description', width: 300 },
    {
      title: '价值',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => `${record.amount} ${record.currency}`, // 组合显示amount和currency
    },
    {
      title: '价值(公众号)',
      dataIndex: 'amount0',
      key: 'amount0',
      render: (_, record) => `${record.amount0} ${record.currency}`,
    },
    { title: '支付渠道', dataIndex: 'pay_channel', key: 'pay_channel' },
    { title: '收益率', dataIndex: 'profit_percent', key: 'profit_percent' },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button className="mr-2" onClick={() => onCreateCoupon(record)} type="primary">
            发卡
          </Button>
          <Button onClick={() => onEditVip(false, record)} type="default">
            编辑
          </Button>
        </div>
      ),
    },
  ];
  // -------------分页 table end
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
  const onCreateCoupon = () => {
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
  // --------------新增或编辑会员信息 start
  const [addOrEditModelProps, setAddOrEditModelProps] = useState<AddOrEditModelProps>({
    formValue: {
      id: 0,
      kind: 0,
      description: '',
      amount: 0,
      amount0: 0,
      pay_channel: '',
      profit_percent: 0,
    },
    title: '新增会员等级',
    show: false,
    onOk: () => {
      setAddOrEditModelProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setAddOrEditModelProps((prev) => ({ ...prev, show: false }));
    },
    type: 'add',
  });
  const onCreateVip = (addFlag: boolean) => {
    setAddOrEditModelProps((prev) => ({
      ...prev,
      show: true,
      addFlag,
      title: addFlag ? '新增会员等级' : '编辑会员等级',
      formValue: {
        ...prev.formValue,
        title: '',
        pay_channel: '',
        currency: 'CNY',
        currency0: 'CNY',
        description: '',
        description0: '',
        profit_percent: 0,
        twtter_total: 0,
        tweet_total_of_day: 0,
      },
    }));
  };
  const onEditVip = (addFlag: boolean, record: MemberTable) => {
    setAddOrEditModelProps((prev) => ({
      ...prev,
      show: true,
      addFlag,
      title: '编辑会员等级',
      formValue: {
        ...record,
      },
    }));
  };
  // --------------新增或编辑会员信息 end
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card
          title="会员等级列表"
          extra={
            <Button type="primary" onClick={onCreateVip}>
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
        <AddOrEditModel {...addOrEditModelProps} />
      </Space>
    </>
  );
}

type AddOrEditModelProps = {
  formValue: MemberTable;
  title: String;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  addFlag: boolean;
  // memberList: Array<OptionType>;
};

// 新增目录标签
function AddOrEditModel({ title, show, formValue, onOk, onCancel, addFlag }: AddOrEditModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const handleVipType = (e: RadioChangeEvent) => {
    formValue.kind = e.target.value;
  };
  const handleCurrencyPc = (e: RadioChangeEvent) => {
    formValue.currency = e.target.value;
  };
  const handleCurrencyMp = (e: RadioChangeEvent) => {
    formValue.currency0 = e.target.value;
  };

  // 编辑时候的会员详细信息
  // if (!addFlag) {
  //   const { data: VipInfo, isLoading: vipInfoLoading } = useQuery({
  //     queryKey: ['vip-level', formValue.id],
  //     queryFn: async () => {
  //       const res = await navService.GetVipLevel(formValue.id);
  //       return res;
  //     },
  //     enabled: !!formValue.id, // 确保 level_id 存在时才执行请求
  //   });
  // }
  // 新增
  const queryClient = useQueryClient();
  const addVipLevelMutation = useMutation({
    mutationFn: async (params: MemberTable) => {
      const res = await navService.AddVipLevel(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error adding website:', error); // 处理错误
    },
  });
  // 编辑
  const editVipLevelMutation = useMutation({
    mutationFn: async (params: { levelId: number; data: MemberTable }) => {
      const { levelId, data } = params;
      const res = await navService.EditVipLevel(levelId, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error editing VIP level:', error); // 处理错误
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      if (addFlag) {
        addVipLevelMutation.mutate(values); // 提交表单数据进行新增
      } else {
        const { id, ...data } = values; // 从表单值中解构出 id 和其他数据
        editVipLevelMutation.mutate({ levelId: id, data }); // 提交表单数据进行编辑
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  return (
    <Modal width={600} title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
      >
        <Form.Item<MemberTable> label="种类" name="kind" required>
          <Radio.Group onChange={handleVipType} value={formValue.kind}>
            {VipOption?.map((item, index) => (
              <Radio key={index} value={item.id}>
                {item.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item<MemberTable> label="名称" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<MemberTable> label="支付渠道" name="pay_channel" required>
          <Input />
        </Form.Item>
        <Form.Item<MemberTable> label="价格" name="acount" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<MemberTable> label="货币" name="currency" required>
          <Select
            onChange={handleCurrencyPc}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'BTC', label: 'BTC' },
              { value: 'ETH', label: 'ETH' },
              { value: 'CNY', label: 'CNY' },
            ]}
          />
        </Form.Item>
        <Form.Item<MemberTable> label="等级描述" name="description" required>
          <TextArea showCount maxLength={200} placeholder="描述内容" />
        </Form.Item>
        <Form.Item<MemberTable> label="价格(公众号)" name="acount0" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<MemberTable> label="货币(公众号)" name="currency0" required>
          <Select
            onChange={handleCurrencyMp}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'BTC', label: 'BTC' },
              { value: 'ETH', label: 'ETH' },
              { value: 'CNY', label: 'CNY' },
            ]}
          />
        </Form.Item>
        <Form.Item<MemberTable> label="描述(公众号)" name="description0" required>
          <TextArea showCount maxLength={200} placeholder="描述内容" />
        </Form.Item>
        <Form.Item<MemberTable> label="推特订阅数" name="twtter_total" required>
          <InputNumber />
        </Form.Item>
        <Form.Item<MemberTable> label="推文日推送量" name="tweet_total_of_day" required>
          <InputNumber />
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
  // memberList: Array<OptionType>;
};

// 新增目录标签
function CreateCardModel({ title, show, formValue, onOk, onCancel }: CreateCardModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const handleVipType = (value: number) => {
    formValue.vip_level_id = value;
  };
  const handleCurrency = (value: string) => {
    formValue.currency = value;
  };
  // 新增
  const queryClient = useQueryClient();
  const createCounponMutation = useMutation({
    mutationFn: async (params: CouponCreateReq) => {
      const res = await navService.CouponCreate(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberList']); // 成功新增后，重新获取数据或更新缓存
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
            onChange={handleVipType}
            options={VipOption?.map((option: any) => ({ label: option.title, value: option.id }))}
            value={formValue.vip_level_id}
            // label= {}
          />
        </Form.Item>
        <Form.Item<ConsumerCard> label="价格" name="price" required>
          <Input />
        </Form.Item>
        <Form.Item<ConsumerCard> label="货币" name="currency" required>
          <Select
            onChange={handleCurrency}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'BTC', label: 'BTC' },
              { value: 'ETH', label: 'ETH' },
              { value: 'CNY', label: 'CNY' },
            ]}
          />
        </Form.Item>
        <Form.Item<ConsumerCard> label="站点" name="web_site_id" required>
          <Input />
        </Form.Item>
        <Form.Item<ConsumerCard> label="生成数量" name="vip_level_id" required>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}
