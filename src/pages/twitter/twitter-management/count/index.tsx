import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Space,
  message,
  Button,
  Radio,
  Checkbox,
  Form,
  Row,
  Col,
  Input,
  Tag,
  Tooltip,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import twitterService, {
  GetAcountListReq,
  GetChildCateGoryReq,
} from '@/api/services/twitterService';
import { Iconify } from '@/components/icon';

import DetailModel from './detail';
import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { TweetCount } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function TwitterAcountList() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [AcountQuery, setAcountQuery] = useState<GetAcountListReq>({
    area_id: '',
    limit: 20,
    // name: '',
    p_c_path: [],
    page: 1,
    // username: '',
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['TwitterAcountList', AcountQuery],
    queryFn: () => twitterService.GetAcountList(AcountQuery),
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
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 20;
    setAcountQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setAcountQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
      setTableParams({ pagination });
    }
  };
  const [detailModelProps, setDetailModelProps] = useState<DetailModelProps>({
    title: '详细',
    show: false,
    formValue: {},
    onOk: () => {
      setDetailModelProps((prev: TweetCount) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setDetailModelProps((prev: TweetCount) => ({ ...prev, show: false }));
    },
  });
  const onDetail = (record: TweetCount) => {
    setDetailModelProps((prev: TweetCount) => ({
      ...prev,
      show: true,
      formValue: record,
    }));
  };
  const onEditTag = (record: TweetCount) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      show: true,
      tableValue: record,
      theasaurusList,
    }));
  };
  const columns: ColumnsType<TweetCount> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'center',
      render: (_, record) => (
        // 跳转https://x.com/trondao
        <a href={`https://x.com/${record.username}`} target="_blank" rel="noopener noreferrer">
          {record.name}
        </a>
      ),
    },
    {
      title: '头像',
      dataIndex: 'profile_image_url',
      key: 'profile_image_url',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
    },
    {
      title: '粉丝量',
      dataIndex: 'followers_count',
      key: 'followers_count',
      width: 150,
      align: 'center',
    },
    {
      title: '关注量',
      dataIndex: 'following_count',
      key: 'following_count',
      width: 150,
      align: 'center',
    },
    {
      title: '推特量',
      dataIndex: 'tweet_count',
      key: 'tweet_count',
      width: 100,
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (_, record) => (
        <Tooltip title={record.description}>
          <div
            className="ellipsis"
            style={{
              float: 'left',
              maxWidth: '100px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {record.description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'created_time',
      key: 'created_time',
      width: 250,
      align: 'center',
    },
    {
      title: '标签',
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      render: (_, record) => {
        const categories = record?.categories;
        if (!categories) {
          return <span>-</span>;
        }
        return (
          <div>
            {categories?.map((category: any, catIndex) => (
              <div key={catIndex} style={{ marginBottom: '8px' }}>
                {category.p_c_title
                  .split('/')
                  .filter(Boolean)
                  .map((title: string, index: number, array: string[]) => (
                    <span key={index}>
                      <Tag color="blue" style={{ marginInlineEnd: '0' }}>
                        {title}
                      </Tag>
                      {index < array.length - 1 && (
                        <Iconify icon="ic:sharp-play-arrow" size={16} color="#1890ff" />
                      )}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type="primary" className="mr-2" onClick={() => onDetail(record)}>
            详细
          </Button>
          <Button type="default" onClick={() => onEditTag(record)}>
            添加标签
          </Button>
        </div>
      ),
    },
  ];
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
  const [categoryQuery, setCategoryQuery] = useState<GetChildCateGoryReq>({
    area_id: '',
    p_c_id: '-1',
    level: 0,
  });
  const { data: theasaurusList } = useQuery({
    queryKey: ['TwitterTheasaurusList'],
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
    setAcountQuery((prev) => {
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
    setAcountQuery((prev: any) => ({
      ...prev,
      limit: 20,
      page: 1,
      area_id: theasaurusTagId,
      p_c_path: data,
    }));
  };
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
    setAcountQuery({
      area_id: '',
      limit: 20,
      p_c_path: [],
      page: 1,
    });
    setTheasaurusTagId('');
    setCategoryIds({
      categoryIdOne: '',
      categoryIdTwo: '',
      categoryIdThree: '',
    });
  };
  const [searchFormValues, setSearchFormValues] = useState<GetAcountListReq>({});
  const onSearchSubmit = async () => {
    const values = await searchForm.validateFields();
    setAcountQuery({ ...values, page: 1, limit: 10 });
  };
  const [selectItems, setSelectItems] = useState<string[]>([]);
  const onChangeTableList = (selectedRowKeys: any, selectedRows: any) => {
    const authoIds = selectedRows.map((item: any) => item.author_id);
    setSelectItems(authoIds);
  };
  const onHandleTags = () => {
    if (selectItems.length === 0) {
      messageApi.error('请选择打标签的账号');
      return;
    }
    setEditorOrAddModelProps((prev: any) => ({
      ...prev,
      show: true,
      tableValue: {
        author_id: selectItems,
      },
      theasaurusList,
    }));
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm} initialValues={searchFormValues}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={6}>
                <Form.Item label="账号" name="username" className="!mb-0">
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
                  value: item.c_id,
                }))}
                onChange={onChangeCategoryThreeTag}
              />
            </div>
          )}
        </Card>
        <Card
          title="群组内容"
          extra={
            <div>
              <Button style={{ background: '#1DA57A', color: '#fff' }} onClick={onHandleTags}>
                批量打标签
              </Button>
            </div>
          }
        >
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            rowSelection={{ type: 'checkbox', onChange: onChangeTableList }}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
        <DetailModel {...detailModelProps} />
      </Space>
    </>
  );
}
