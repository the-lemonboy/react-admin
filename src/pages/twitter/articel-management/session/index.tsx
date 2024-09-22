import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Space,
  message,
  Tooltip,
  Button,
  Switch,
  Radio,
  Checkbox,
  Form,
  Row,
  Col,
  Input,
  Drawer,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import twitterService, {
  GetSessionListReq,
  SetArticlesStatusReq,
} from '@/api/services/twitterService';

// import DelTagModel, { DelTagModelProps } from './delTag';
// import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { TweetSessionConv } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function Session() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [sessionQuery, setSessionQuery] = useState<GetSessionListReq>({
    limit: 20,
    page: 1,
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['twitterSessionList', sessionQuery],
    queryFn: () => twitterService.GetSessionList(sessionQuery),
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
    setSessionQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setSessionQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
      setTableParams({ pagination });
    }
  };
  // const onEditTag = (record: TweetSessionConv) => {
  //   setEditorOrAddModelProps((prev) => ({
  //     ...prev,
  //     show: true,
  //     tableValue: record,
  //     theasaurusList,
  //   }));
  // };
  // 使用 useMutation 钩子处理删除操作
  const delArticlemutation = useMutation({
    mutationFn: twitterService.DelSession,
    onSuccess: () => {
      messageApi.success('删除成功');
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['twitterSessionList', sessionQuery]);
    },
    onError: (error) => {
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });
  const onDelTag = (record: TweetSessionConv) => {
    const delData = { tweet_ids: [record.tweet_id] };
    delArticlemutation.mutate(delData);
  };
  const columns: ColumnsType<TweetSessionConv> = [
    // { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    {
      title: '作者',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="text-blue underline decoration-solid" onClick={() => showDrawer(record)}>
          {record.name}
        </div>
      ),
    },
    {
      title: '头像',
      dataIndex: 'profile_image_url0',
      key: 'profile_image_url0',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
    },
    {
      title: '描述',
      dataIndex: 'text',
      key: 'text',
      width: 200,
      render: (_, record) => (
        <Tooltip title={record.text}>
          <div
            className="ellipsis"
            style={{
              float: 'left',
              maxWidth: '180px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {record.text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '语言',
      dataIndex: 'lang',
      key: 'lang',
      width: 50,
      align: 'center',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
      width: 50,
      align: 'center',
    },
    {
      title: '回复',
      dataIndex: 'reply_count',
      key: 'reply_count',
      width: 50,
      align: 'center',
    },
    {
      title: '转推',
      dataIndex: 'retweet_count',
      key: 'retweet_count',
      width: 50,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'hidden',
      key: 'hidden',
      width: 100,
      align: 'center',
      render: (_: any, record: any) => (
        <Switch
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          defaultChecked={record.hidden}
          checked={!record.hidden}
          onClick={(checked, e) => onChanheHideStatus(checked, record, e)}
        />
      ),
    },
  ];
  const changeDistributedMutation = useMutation({
    mutationFn: async (params: SetArticlesStatusReq) => {
      const res = await twitterService.SetSessionStatus(params);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success('状态修改成功');
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['twitterSessionList', sessionQuery]);
    },
    onError: (error) => {
      messageApi.error('状态修改失败');
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });
  const onChanheHideStatus = (checked: boolean, record: TweetSessionConv, e: any) => {
    // 修改分发状态逻辑
    changeDistributedMutation.mutate({
      tweet_ids: [record.tweet_id],
      hidden: !checked,
    });
  };
  const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
    title: '标签管理',
    show: false,
    newId: '',
    onOk: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
      // 重新获取数据或更新缓存
      queryClient.invalidateQueries(['mediaList']);
    },
    onCancel: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
  });
  const [theasaurusTagId, setTheasaurusTagId] = useState('');
  const [CategoryIds, setCategoryIds] = useState({
    categoryIdOne: '',
    categoryIdTwo: '',
    categoryIdThree: '',
  });
  const [levelOneList, setLevelOneList] = useState([]);
  const [levelTwoList, setLevelTwoList] = useState([]);
  const [levelThreeList, setLevelThreeList] = useState([]);
  const [categoryQuery, setCategoryQuery] = useState<GetChildCategoryListReq>({
    area_id: '',
    level: -1,
    p_c_id: '',
  });
  const { data: theasaurusList } = useQuery({
    queryKey: ['theasaurusList'],
    queryFn: () => twitterService.GetAreaList(),
  });
  // 查询标签
  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = await twitterService.GetChildCateGory(categoryQuery);
      if (categoryQuery.level === 0) {
        setLevelOneList(data);
      } else if (categoryQuery.level === 1) {
        setLevelTwoList(data);
      } else if (categoryQuery.level === 2) {
        setLevelThreeList(data);
      }
    };
    fetchCategoryData();
  }, [categoryQuery]);

  const onChangeTheasaurusTag = (e: any) => {
    setTheasaurusTagId(e.target.value);
    setCategoryQuery({ area_id: e.target.value, p_c_id: '-1', level: 0 });
  };

  const onChangeCategoryOneTag = (e: any) => {
    setCategoryIds((prev) => ({ ...prev, categoryIdOne: e.target.value }));
    setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 1 }));
  };

  const onChangeCategoryTwoTag = (e: any) => {
    setCategoryIds((prev) => ({ ...prev, categoryIdTwo: e.target.value }));
    setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 2 }));
  };
  useEffect(() => {
    setSessionQuery((prev) => {
      // 这里不要eslint
      // eslint-disable-next-line no-nested-ternary
      const path =
        CategoryIds.categoryIdOne && CategoryIds.categoryIdTwo
          ? `/${CategoryIds.categoryIdOne}/${CategoryIds.categoryIdTwo}`
          : CategoryIds.categoryIdOne
          ? `/${CategoryIds.categoryIdOne}`
          : CategoryIds.categoryIdTwo
          ? `/${CategoryIds.categoryIdTwo}`
          : '';

      return {
        ...prev,
        limit: 20,
        page: 1,
        area_id: theasaurusTagId,
        p_c_path: path ? [path] : [],
      };
    });
  }, [theasaurusTagId, CategoryIds.categoryIdOne, CategoryIds.categoryIdTwo]);
  const onChangeCategoryThreeTag: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    // const data = checkedValues.reduce((pre, cur) => `${pre} ${cur}`, '');
    const data = checkedValues.map(
      (item) => `/${CategoryIds.categoryIdOne}/${CategoryIds.categoryIdTwo}/${item}`,
    );
    setSessionQuery((prev: any) => ({
      ...prev,
      limit: 20,
      page: 1,
      area_id: theasaurusTagId,
      p_c_path: data,
    }));
  };
  const [selectItems, setSelectItems] = useState<string[]>([]);

  const onChangeTableList = (selectedRowKeys: any, selectedRows: TweetSessionConv[]) => {
    const tweetIds = selectedRows.map((item) => item.tweet_id);
    setSelectItems(tweetIds);
  };
  const onChangeSelectHiddenStatus = () => {
    if (selectItems.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请选择要操作的数据',
      });
    } else {
      changeDistributedMutation.mutate({ tweet_ids: selectItems, hidden: true });
    }
  };
  const onChangeSelectShowStatus = () => {
    if (selectItems.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请选择要操作的数据',
      });
    } else {
      changeDistributedMutation.mutate({ tweet_ids: selectItems, hidden: false });
    }
  };
  // const onDelSelectItems = () => {
  //   if (selectItems.length === 0) {
  //     messageApi.open({
  //       type: 'warning',
  //       content: '请选择要操作的数据',
  //     });
  //   } else {
  //     delArticlemutation.mutate({ tweet_ids: selectItems });
  //   }
  // };
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };
  const [searchFormValues, setSearchFormValues] = useState<any>({});
  const onSearchSubmit = async () => {
    const values = await searchForm.validateFields();
    setSessionQuery({ ...values, page: 1, limit: 20 });
  };
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [detailUserInfo, setDetailUserInfo] = useState<TweetSessionConv | undefined>(undefined);
  const [twitterSeesionId, setTwitterSeesionId] = useState('');
  const { data: twitterSessionDetail, isLoading: isTwitterSessionDetailLoading } = useQuery({
    queryKey: ['twitterSessionDetail', twitterSeesionId],
    queryFn: () => twitterService.GetSessionDetail(twitterSeesionId),
    enabled: !!twitterSeesionId,
  });
  const showDrawer = (record: TweetSessionConv) => {
    console.log(record);
    setTwitterSeesionId(record.conv_id);
    setDetailUserInfo(record);
    setDrawerVisible(true);
  };
  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm} initialValues={searchFormValues}>
            <Row gutter={[16, 16]}>
              {/* <Col span={24} lg={6}>
                <Form.Item label="板块" name="area_id" className="!mb-0">
                  <Select>
                    {theasaurusList?.data.map((item: any, index: any) => (
                      <Select.Option key={index} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col> */}
              <Col span={24} lg={6}>
                <Form.Item label="作者" name="author" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="用户名" name="name" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <div className="flex justify-end">
                  <Button onClick={onSearchFormReset}>重置</Button>
                  <Button onClick={onSearchSubmit} type="primary" className="ml-4">
                    搜索
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <div className="mb-4 flex flex-wrap items-center">
            <p className="mr-3 whitespace-nowrap text-base font-bold">词库板块</p>
            <Radio.Group onChange={onChangeTheasaurusTag} value={theasaurusTagId}>
              {theasaurusList?.data.map((item: any, index: number) => (
                <Radio key={index} value={item.id}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          {levelOneList?.length > 0 && levelOneList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">一级标签</p>
              <Radio.Group onChange={onChangeCategoryOneTag} value={CategoryIds.categoryIdOne}>
                {levelOneList?.map((item: any, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelTwoList?.length > 0 && levelTwoList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">二级标签</p>
              <Radio.Group onChange={onChangeCategoryTwoTag} value={CategoryIds.categoryIdTwo}>
                {levelTwoList?.map((item: any, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelThreeList?.length > 0 && levelThreeList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">三级标签</p>
              <Checkbox.Group
                options={levelThreeList.map((item: any) => ({
                  label: item.title,
                  value: item.title,
                }))}
                onChange={onChangeCategoryThreeTag}
              />
            </div>
          )}
        </Card>
        <Card
          title="会话内容"
          extra={
            <div>
              <Button
                className="mr-5"
                style={{ background: '#1DA57A', color: '#fff' }}
                onClick={onChangeSelectShowStatus}
              >
                显示
              </Button>
              <Button
                className="bg-red mr-5"
                style={{ background: '#de3f00', color: '#fff' }}
                onClick={onChangeSelectHiddenStatus}
              >
                隐藏
              </Button>
              {/* <Button type="primary" onClick={onDelSelectItems}>
                删除记录
              </Button> */}
            </div>
          }
        >
          <Table
            rowKey="conv_id"
            size="small"
            columns={columns}
            rowSelection={{ type: 'checkbox', onChange: onChangeTableList }}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
        {/* <EditorOrAddModel {...editorOrAddModelProps} />
        <DelTagModel {...delTagModelProps} /> */}
        <Drawer
          title="用户详情"
          open={drawerVisible}
          onClose={onCloseDrawer}
          loading={isTwitterSessionDetailLoading}
        >
          {twitterSessionDetail && (
            <div className="w-full">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover"
                  src={twitterSessionDetail.profile_image_url0}
                  alt="用户头像"
                />
              </div>
              <div className="mt-4">
                <p className="font-weight text-xl">{twitterSessionDetail.name}</p>
                <p className="font-weight text-xl">账号：{twitterSessionDetail.username}</p>
                <p>账户创建时间: {twitterSessionDetail.created_at}</p>
                <p className="font-weight text-sm text-gray-600">
                  内容：{twitterSessionDetail.text}
                </p>
                <div className="my-5 h-0 w-full border-b-[1px] border-gray-300" />
                {twitterSessionDetail.conv_list?.map((item: any, index: number) => (
                  <div className="mb-10 h-20 w-20 overflow-hidden rounded-full">
                    <img
                      className="h-full w-full object-cover"
                      src={item.profile_image_url0}
                      alt="用户头像"
                    />
                    <p className="font-weight text-xl">{item.name}</p>
                    <p className="font-weight text-xl">账号：{item.username}</p>
                    <p>账户创建时间: {item.created_at}</p>
                    <p className="font-weight text-sm text-gray-600">内容：{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Drawer>
      </Space>
    </>
  );
}
