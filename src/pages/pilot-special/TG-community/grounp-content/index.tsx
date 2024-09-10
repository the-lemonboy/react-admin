import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Space,
  message,
  Button,
  Radio,
  Checkbox,
  Tooltip,
  Form,
  Row,
  Col,
  Select,
  Input,
  Tag,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import TGService, { SearchTGReq } from '@/api/services/TGService';
import { Iconify } from '@/components/icon';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { TG } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function TGGrounpContentList() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [articelQuery, setArticelQuery] = useState<SearchTGReq>({
    area_id: '',
    author: '',
    content: '',
    created_at_range: '',
    group_id: '',
    keyword: [],
    limit: 10,
    message_id: '',
    msg_type: '',
    p_c_path: '',
    page: 1,
    topic_id: '',
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['TGArticelList', articelQuery],
    queryFn: () => TGService.SearchTG(articelQuery),
  });
  // 分页
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
    console.log(pagination);
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setArticelQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setArticelQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 10 }));
      setTableParams({ pagination });
    }
  };
  const onEditTag = (record: TG) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      show: true,
      tableValue: record,
      theasaurusList,
    }));
  };
  const columns: ColumnsType<TG> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: '发布者',
      dataIndex: 'm_author',
      key: 'm_author',
      width: 100,
      align: 'center',
      render: (name: string) => (name === 'unknown' ? '未知' : name),
    },
    {
      title: '话题',
      dataIndex: 'topic.topic_name',
      key: '[topic, topic_name]',
      align: 'center',
      width: 100,
      render: (_, record) => (
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
          {record.topic.topic_name}
        </div>
      ),
    },
    {
      title: '消息内容',
      dataIndex: 'message.text',
      key: 'message.text',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={record.message.text}>
          <div
            className="ellipsis"
            style={{
              float: 'left',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {record.message.text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'topic_id',
      align: 'center',
      dataIndex: 'topic_id',
      key: 'topic_id',
      render: (_, record) => {
        if (!record.topic_id) {
          return <span>-</span>;
        }
        return <span>{record.topic_id}</span>;
      },
    },
    {
      title: '社群名称',
      align: 'center',
      dataIndex: ['group', 'group_name'],
      key: 'group.group_name',
    },
    {
      title: '标签',
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      render: (_, record) => {
        const categories = record.group?.category;
        if (!categories) {
          return <span>-</span>;
        }
        return (
          <div>
            {categories?.map((category, catIndex) => (
              <div key={catIndex} style={{ marginBottom: '8px' }}>
                {category.p_c_path_title
                  .split('/')
                  .filter(Boolean)
                  .map((title, index, array) => (
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
    { title: '发布时间', dataIndex: 'created_at', key: 'created_at', align: 'center' },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type="primary" onClick={() => onEditTag(record)}>
            添加标签
          </Button>
        </div>
      ),
    },
  ];
  const changeMediaStatus = useMutation({
    mutationFn: (params: Media) => {
      const res = newsService.ChangeMediaStatus(params);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaList']);
      messageApi.open({
        type: 'success',
        content: '状态修改成功',
      });
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: '状态修改失败',
      });
    },
  });
  // const onChangeMediaStatus = (checked: boolean, record: Media) => {
  //   // 修改分发状态逻辑
  //   changeMediaStatus.mutate({
  //     media_title: record.media_title,
  //     opt_status: checked,
  //   });
  // };

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
      queryClient.invalidateQueries(['TGArticelList']);
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
    queryKey: ['TGTheasaurusList'],
    queryFn: () => TGService.GetAreaList(),
  });
  // 查询标签
  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = await TGService.GetChildCateGory(categoryQuery);
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
    setArticelQuery((prev) => ({
      ...prev,
      limit: 10,
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
    setArticelQuery({ ...values, page: 1, limit: 10 });
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
                    {theasaurusList?.data.map((item: Theasaurus, index) => (
                      <Select.Option key={index} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="发布者" name="author" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="社群Id" name="group_id" className="!mb-0">
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
        <Card title="群组内容">
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
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}
