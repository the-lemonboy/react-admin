import { useQuery } from '@tanstack/react-query';
import { Card, Space, message, Switch, Button, TableProps, Form, Row, Col, Select } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import newsService from '@/api/services/newsService';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { Theasaurus, NewsCategory } from '#/entity';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
interface MediaTableType {
  media_key: string;
  media_title: string;
  opt_status: boolean;
}
type SearchFormFieldType = {};
export default function CategoryTag() {
  const [messageApi, contextHolder] = message.useMessage();
  // const [query, setQuery] = useState<{ limit: number; page: number }>({ limit: 10, page: 1 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['newsCategroyList'],
    queryFn: () => newsService.GetCategoryList(),
  });
  // const [tableParams, setTableParams] = useState<TableParams>({
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //     total: tableList?.count,
  //   },
  // });

  // useEffect(() => {
  //   if (tableList) {
  //     setTableParams((prev) => ({
  //       ...prev,
  //       pagination: {
  //         ...prev.pagination,
  //         total: tableList?.count,
  //       },
  //     }));
  //   }
  // }, [tableList]);

  // const handleTableChange: TableProps<MediaTableType>['onChange'] = (pagination) => {
  //   const current = pagination.current ?? 1;
  //   const pageSize = pagination.pageSize ?? 10;
  //   setQuery({ page: current, limit: pageSize });
  //   setTableParams({ pagination });
  //   if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //     // 清空数据
  //     // setData([]); // 确保这里有数据清空逻辑
  //   }
  // };
  const { data: theasaurusList } = useQuery({
    queryKey: ['theasaurusList'],
    queryFn: () => newsService.GetTheasaurusList(),
  });
  const columns: ColumnsType<NewsCategory> = [
    { title: 'ID', dataIndex: 'c_id', key: 'c_id' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '名称(大写)', dataIndex: 'upper_title', key: 'upper_title' },
    { title: '所属板块', dataIndex: 'area_title', key: 'area_title' },
    {
      title: '状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <Switch
          checkedChildren="开放"
          unCheckedChildren="禁用"
          defaultChecked={!record.opt_status}
          onChange={(checked) => onChangeMediaStatus(checked, record)}
        />
      ),
    },
  ];

  const onChangeMediaStatus = (checked: boolean, record: MediaTableType) => {
    // 修改分发状态逻辑
    // 记得取反
    console.log('Media status changed:', checked, record);
  };

  const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
    title: '新增媒体',
    show: false,
    formValue: {},
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
    addFlag: true,
  });

  const onCreateMedia = (addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增媒体',
      show: true,
      formValue: {},
      addFlag,
    }));
  };
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={6}>
                <Form.Item<Theasaurus> label="板块" name="area_key" className="!mb-0">
                  <Select>
                    {theasaurusList?.data.map((item: Theasaurus) => (
                      <Select.Option key={item.area_key} value={item.area_key}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item<SearchFormFieldType> label="Status" name="status" className="!mb-0">
                  {/* <Select>
                    <Select.Option value="enable" />
                    <Select.Option value="disable" />
                  </Select> */}
                </Form.Item>
              </Col>
              <Col span={24} lg={12}>
                <div className="flex justify-end">
                  <Button onClick={onSearchFormReset}>Reset</Button>
                  <Button type="primary" className="ml-4">
                    Search
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="媒体管理"
          extra={
            <Button type="primary" onClick={() => onCreateMedia(true)}>
              新增
            </Button>
          }
        >
          <Table
            rowKey="media_key"
            size="small"
            columns={columns}
            dataSource={tableList?.data}
            loading={isLoadingList}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}
