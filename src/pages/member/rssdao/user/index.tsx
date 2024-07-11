import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Card,
  Space,
  message,
  Switch,
  Button,
  TableProps,
  Form,
  Row,
  Col,
  Select,
  Input,
  Drawer,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import memberService, { GetUserListReq, SuspendedUserReq } from '@/api/services/memberService';

import { UserTable } from '#/entity';
import type { GetProp } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function NewsCategoryTag() {
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<GetUserListReq>({ page: 1, limit: 10 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['userList', query],
    queryFn: () => memberService.GetUserList(query),
  });
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: tableList?.count,
    },
  });
  const handleTableChange: TableProps<UserTable>['onChange'] = (pagination) => {
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setQuery({ ...query, page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      // 清空数据
      setData([]); // 确保这里有数据清空逻辑
    }
  };

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailUserInfo, setDetailUserInfo] = useState<UserTable | undefined>(undefined);

  const showDrawer = (record: UserTable) => {
    setDetailUserInfo(record);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const columns: ColumnsType<UserTable> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="text-blue underline decoration-solid" onClick={() => showDrawer(record)}>
          {record.name}
        </div>
      ),
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 80,
      render: (text: string) => <img src={text} alt="icon" style={{ width: 30, height: 30 }} />,
    },
    { title: '手机', dataIndex: 'mobile_number', key: 'mobile_number' },
    { title: '站点', dataIndex: 'web_site_name', key: 'web_site_name' },
    {
      title: '状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <Switch
          checkedChildren="开放"
          unCheckedChildren="禁用"
          checked={!record.suspended}
          onChange={(checked) => onChangeMediaStatus(checked, record)}
        />
      ),
    },
  ];

  const changeUserStatus = useMutation({
    mutationFn: (param: SuspendedUserReq) => {
      const res = memberService.SuspendedUser(param);
      return res;
    },
    onSuccess: () => {
      messageApi.success('操作成功');
    },
    onError: () => {
      messageApi.error('操作失败');
    },
  });

  const onChangeMediaStatus = (checked: boolean, record: UserTable) => {
    // 修改用户状态逻辑
    changeUserStatus.mutate({ id: record.id, suspended: !checked });
  };

  // 搜索
  const [searchForm] = Form.useForm();

  const onSearchFormReset = () => {
    searchForm.resetFields();
    setQuery({ page: 1, limit: 10 });
  };

  const onSearchSubmit = async () => {
    try {
      const values = await searchForm.validateFields();
      setQuery({ ...values, page: 1, limit: 10 });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={6}>
                <Form.Item<GetUserListReq> label="用户名" name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item<GetUserListReq> label="手机号" name="mobile_number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item<GetUserListReq> label="状态" name="suspended">
                  <Select>
                    <Select.Option value="">全部</Select.Option>
                    <Select.Option value="false">开放</Select.Option>
                    <Select.Option value="true">禁用</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item<GetUserListReq> label="网站ID" name="web_site_id">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div className="flex justify-end">
                  <Button onClick={onSearchFormReset}>重置</Button>
                  <Button type="primary" className="ml-4" onClick={onSearchSubmit}>
                    搜索
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="用户管理">
          <Table
            rowKey="id" // 使用正确的唯一标识符，例如 id
            size="small"
            columns={columns}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
        <Drawer title="用户详情" open={drawerVisible} onClose={onCloseDrawer}>
          {detailUserInfo && (
            <div className="w-full">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover"
                  src={detailUserInfo.avatar}
                  alt="用户头像"
                />
              </div>
              <div className="mt-4">
                <p className="font-weight text-xl">{detailUserInfo.name}</p>
                <p className="text-gray-600">
                  {detailUserInfo.mobile_number ? detailUserInfo.mobile_number : '无手机号'}
                </p>
                <p>状态: {detailUserInfo.suspended ? '禁用' : '开放'}</p>
                <p>账户创建时间: {detailUserInfo.created_time}</p>
              </div>
            </div>
          )}
        </Drawer>
      </Space>
    </>
  );
}
