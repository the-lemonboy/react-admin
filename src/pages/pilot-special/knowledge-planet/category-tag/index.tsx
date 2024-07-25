import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  Popconfirm,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import planetService from '@/api/services/planetService';
import { ArrayToTree } from '@/utils/tree';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { Theasaurus, PlanetCategory } from '#/entity';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
interface TreeCategory extends PlanetCategory {
  children?: TreeCategory[];
}
interface MediaTableType {
  media_key: string;
  media_title: string;
  opt_status: boolean;
}
type SearchFormFieldType = {};
export default function NewsCategoryTag() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<{ area_id?: string }>({ area_id: '' });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['PlanetCategroyList', query],
    queryFn: () => planetService.GetCategoryList(query),
  });
  const [treeCategory, setTreeCategory] = useState<NewsCategory[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList.data) as TreeCategory[]);
    }
  }, [tableList]);
  const { data: theasaurusList } = useQuery({
    queryKey: ['planetAreaList'],
    queryFn: () => planetService.GetAreaList(),
  });
  const columns: ColumnsType<PlanetCategory> = [
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
          onChange={(checked) => onChangeStatus(checked, record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button className="mr-2" type="primary" onClick={() => onAddChildTag(record, true)}>
            添加下级
          </Button>
          <Button className="mr-2" onClick={() => onEditTag(record, false)}>
            编辑
          </Button>
          <Popconfirm
            title="Delete the Website"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => onDelTag(record)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const onAddChildTag = (record: PlanetCategory, addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增标签',
      show: true,
      formValue: {
        p_c_id: record.c_id,
        upper_title: record.title,
        area_id: record.area_id,
        opt_status: false,
        title: '',
      },
      addFlag,
      treeCategory,
      addChildFlag: false,
    }));
  };
  const onEditTag = (record: PlanetCategory, addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '编辑标签',
      show: true,
      formValue: {
        area_id: record.area_id,
        p_c_id: -1,
        upper_title: record.upper_title,
        title: record.title,
        opt_status: record.opt_status,
      },
      addFlag,
      treeCategory,
      addChildFlag: false,
    }));
  };
  // 删除
  const delCategoryTag = useMutation({
    mutationFn: planetService.DelCateGory,
    onSuccess: () => {
      queryClient.invalidateQueries(['PlanetCategroyList']);
      messageApi.success('删除成功');
    },
    onError: () => {
      messageApi.error('删除失败');
    },
  });
  const onDelTag = (record: PlanetCategory) => {
    delCategoryTag.mutate(record.c_id);
  };
  const changeCategoryStatus = useMutation({
    mutationFn: planetService.ChangeCategoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['PlanetCategroyList']);
      messageApi.success('修改成功');
    },
    onError: () => {
      messageApi.error('修改失败');
    },
  });
  const onChangeStatus = (checked: boolean, record: PlanetCategory) => {
    // 修改分发状态逻辑
    changeCategoryStatus.mutate({
      c_id: record.c_id,
      opt_status: !checked,
    });
  };

  const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
    title: '新增标签',
    show: false,
    formValue: {},
    onOk: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
    onCancel: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
    addFlag: true,
  });

  const onCreateNewsCategory = (addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增标签',
      show: true,
      formValue: {
        area_id: '',
        p_c_id: -1,
        upper_title: '',
        title: '',
        opt_status: true,
      },
      addFlag,
      treeCategory,
      addChildFlag: false,
    }));
  };
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };
  const [searchFormValues, setSearchFormValues] = useState<SearchFormFieldType>({});
  const onSearchSubmit = async () => {
    const values = await searchForm.validateFields();
    setQuery({ ...values });
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
              <Col span={24} lg={18}>
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
        <Card
          title="媒体管理"
          extra={
            <Button type="primary" onClick={() => onCreateNewsCategory(true)}>
              新增
            </Button>
          }
        >
          <Table
            rowKey="c_id"
            size="small"
            columns={columns}
            dataSource={treeCategory}
            loading={isLoadingList}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}