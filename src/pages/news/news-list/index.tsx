import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Button, Radio, Checkbox, Form, Row, Col, Select, Input } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import newsService, { GetChildCategoryListReq, GetNewsListReq } from '@/api/services/newsService';

import { Media, NewsCategory } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function NewsList() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [newsQuery, setNewsQuery] = useState<GetNewsListReq>({
    limit: 20,
    page: 1,
    area_id: '',
    content: '',
    date_range: '',
    exchange_media: '',
    last_level_cats: '',
    level_cat: '',
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['newsList', newsQuery],
    queryFn: () => newsService.SearchNewsList(newsQuery),
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
    setNewsQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setNewsQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
      setTableParams({ pagination });
    }
  };
  const columns: ColumnsType<Media> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    { title: '标题', dataIndex: 'title', key: 'title', width: 300, align: 'center' },
    {
      title: '新闻平台',
      dataIndex: 'exchange_media_title',
      width: 100,
      align: 'center',
    },
    { title: '发布时间', dataIndex: 'pub_time', key: 'pub_time', width: 200, align: 'center' },
    {
      title: '接受时间',
      dataIndex: 'created_time',
      key: 'created_time',
      width: 200,
      align: 'center',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'opt_status',
    //   key: 'opt_status',
    //   align: 'center',
    //   render: (_, record) => (
    //     <div className="flex w-full justify-center text-gray">
    //       <Button type="primary">详细</Button>
    //     </div>
    //   ),
    // },
  ];
  // const changeMediaStatus = useMutation({
  //   mutationFn: (params: Media) => {
  //     const res = newsService.ChangeMediaStatus(params);
  //     return res;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['mediaList']);
  //     messageApi.open({
  //       type: 'success',
  //       content: '状态修改成功',
  //     });
  //   },
  //   onError: () => {
  //     messageApi.open({
  //       type: 'error',
  //       content: '状态修改失败',
  //     });
  //   },
  // });
  // const onChangeMediaStatus = (checked: boolean, record: Media) => {
  //   // 修改分发状态逻辑
  //   changeMediaStatus.mutate({
  //     media_title: record.media_title,
  //     opt_status: checked,
  //   });
  // };

  // const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
  //   title: '新增媒体',
  //   show: false,
  //   formValue: {},
  //   onOk: () => {
  //     setEditorOrAddModelProps((prev) => ({
  //       ...prev,
  //       show: false,
  //     }));
  //     // 重新获取数据或更新缓存
  //     queryClient.invalidateQueries(['mediaList']);
  //   },
  //   onCancel: () => {
  //     setEditorOrAddModelProps((prev) => ({
  //       ...prev,
  //       show: false,
  //     }));
  //   },
  //   addFlag: true,
  // });

  // const onCreateMedia = (addFlag: boolean) => {
  //   setEditorOrAddModelProps((prev) => ({
  //     ...prev,
  //     title: '新增媒体',
  //     show: true,
  //     formValue: {},
  //     addFlag,
  //   }));
  // };
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
    queryFn: () => newsService.GetTheasaurusList(),
  });
  const { data: NewsKeywordList } = useQuery({
    queryKey: ['NewsKeywordList'],
    queryFn: () => newsService.GetNewsKeyword(),
  });
  // 查询标签
  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = await newsService.GetChildCateGory(categoryQuery);
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
    setCategoryQuery({ p_c_id: '-1', area_id: e.target.value, level: 0 });
  };
  const onChangeCategoryOneTag = (e: any) => {
    setCategoryIds((prev) => ({ ...prev, categoryIdOne: e.target.value }));
    setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 1 }));
  };
  const onChangeCategoryTwoTag = (e: any) => {
    setCategoryIds((prev) => ({ ...prev, categoryIdTwo: e.target.value }));
    setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 2 }));
  };
  const onChangeCategoryThreeTag: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    const data = checkedValues.reduce((pre, cur) => {
      return `${pre} ${cur}`;
    }, '');
    setNewsQuery((prev) => ({
      ...prev,
      limit: 20,
      page: 1,
      content: data as string,
    }));
  };
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };
  const [searchFormValues, setSearchFormValues] = useState<SearchTGReq>({});
  const onSearchSubmit = async () => {
    const values = await searchForm.validateFields();
    setNewsQuery({ ...values, page: 1, limit: 20 });
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm} initialValues={searchFormValues}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={6}>
                <Form.Item label="板块" name="area_id" className="!mb-0">
                  <Select>
                    {theasaurusList?.data.map((item: any, index: number) => (
                      <Select.Option key={index} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="新闻平台" name="exchange_media" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="关键词" name="content" className="!mb-0">
                  <Select>
                    {NewsKeywordList?.map((item: any, index: number) => (
                      <Select.Option key={index} value={item.keyword}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>
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
              {theasaurusList?.data.map((item: NewsCategory, index: number) => (
                <Radio key={index} value={item.id}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          {levelOneList.length > 0 && levelOneList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">一级标签</p>
              <Radio.Group onChange={onChangeCategoryOneTag} value={CategoryIds.categoryIdOne}>
                {levelOneList?.map((item: NewsCategory, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelTwoList.length > 0 && levelTwoList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">二级标签</p>
              <Radio.Group onChange={onChangeCategoryTwoTag} value={CategoryIds.categoryIdTwo}>
                {levelTwoList?.map((item: NewsCategory, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelThreeList.length > 0 && levelThreeList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">三级标签</p>
              <Checkbox.Group
                options={levelThreeList.map((item: NewsCategory) => ({
                  label: item.title,
                  value: item.title,
                }))}
                onChange={onChangeCategoryThreeTag}
              />
            </div>
          )}
        </Card>
        <Card
          title="快讯列表"
          // extra={
          //   <Button type="primary" onClick={() => onCreateMedia(true)}>
          //     新增
          //   </Button>
          // }
        >
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
        {/* <EditorOrAddModel {...editorOrAddModelProps} /> */}
      </Space>
    </>
  );
}
