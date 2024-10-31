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
  Checkbox,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import twitterService from '@/api/services/twitterService';
import { ArrayToTree } from '@/utils/tree';

import EditorOrAddModel from './editOrAddModel';

import { Theasaurus, PlanetCategory } from '#/entity';

type TableRowSelection<T> = TableProps<T>['rowSelection'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
type SearchFormFieldType = {};
export default function TwitterCategoryTag() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<{ area_id?: string }>({ area_id: '' });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['TwitterCategroyList', query],
    queryFn: () => twitterService.GetCategoryList(query),
  });
  const [treeCategory, setTreeCategory] = useState<any[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList.data) as PlanetCategory[]);
    }
  }, [tableList]);
  const { data: theasaurusList } = useQuery({
    queryKey: ['planetAreaList'],
    queryFn: () => twitterService.GetAreaList(),
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
            title="确认删除"
            okText="是"
            cancelText="否"
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
    setEditorOrAddModelProps((prev: any) => ({
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
    setEditorOrAddModelProps((prev: any) => ({
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
    mutationFn: twitterService.DelCateGory,
    onSuccess: () => {
      queryClient.invalidateQueries(['TwitterCategroyList']);
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
    mutationFn: twitterService.ChangeCategoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['TwitterCategroyList']);
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

  const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<any>({
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
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: TreeCategory[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const paths = selectedRows.map((item) => item.p_c_path);
    setSelectedPath(paths);
    console.log('Selected paths changed: ', paths);
  };
  const rowSelection: TableRowSelection<TreeCategory> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isExpandAll, setIsExpandAll] = useState(false);
  useEffect(() => {
    if (isExpandAll) {
      const getAllKeys = (data: any) => {
        let keys = [] as React.Key[];
        data.forEach((item: any) => {
          keys.push(item.c_id);
          if (item.children && item.children.length > 0) {
            keys = keys.concat(getAllKeys(item.children));
          }
        });
        return keys;
      };
      const allKeys = getAllKeys(treeCategory);
      setExpandedRowKeys(allKeys);
    } else {
      setExpandedRowKeys([]);
    }
  }, [isExpandAll, treeCategory]);
  const expandAllRows = () => {
    const allKeys = treeCategory.flatMap((item) => {
      const collectKeys = (node) => {
        if (!node.children) return [node.c_id];
        return [node.c_id, ...node.children.flatMap(collectKeys)];
      };
      return collectKeys(item);
    });
    setExpandedRowKeys(allKeys);
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
          title="标签管理"
          extra={
            <Button type="primary" onClick={() => onCreateNewsCategory(true)}>
              新增
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Checkbox
                checked={isExpandAll}
                onChange={(e) => {
                  setIsExpandAll(e.target.checked);
                  if (e.target.checked) {
                    expandAllRows();
                  } else {
                    setExpandedRowKeys([]);
                  }
                }}
              >
                展开全部
              </Checkbox>
            </Col>
          </Row>
          <Table
            rowKey="c_id"
            size="small"
            columns={columns}
            dataSource={treeCategory}
            loading={isLoadingList}
            rowSelection={rowSelection}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys((prev) => [...prev, record.c_id]);
                } else {
                  setExpandedRowKeys((prev) => prev.filter((key) => key !== record.c_id));
                }
              },
            }}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}
