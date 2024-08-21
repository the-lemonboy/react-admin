import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Switch, Button, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';

import navService, { DelCateGoryReq, ChangeCategoryStatusReq } from '@/api/services/navService';
import { ArrayToTree } from '@/utils/tree';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { WebsiteCategory, NewsCategory } from '#/entity';

interface TreeCategory extends NewsCategory {
  children?: TreeCategory[];
}
type SearchFormFieldType = {};
export default function WebsiteCategoryTag() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<{ area_id?: string }>({ area_id: '' });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['WebsiteCategroyList'],
    queryFn: () => navService.CateGoryList(query),
  });
  // const [optionsDataList, setOptionsDataList] = useState([]);
  // useEffect(() => {
  //   navService.CateGoryList().then((res) => {
  //     setOptionsDataList(res);
  //   });
  // }, []);
  const [treeCategory, setTreeCategory] = useState<NewsCategory[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList) as TreeCategory[]);
    }
  }, [tableList]);
  const columns: ColumnsType<WebsiteCategory> = [
    { title: 'ID', dataIndex: 'c_id', key: 'c_id' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    {
      title: '状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <Switch
          // checked={record.opt_status}
          checkedChildren="开放"
          unCheckedChildren="禁用"
          defaultChecked={!record.opt_status}
          onChange={(checked) => onChangeMediaStatus(checked, record)}
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
  const onAddChildTag = (record: WebsiteCategory, addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增标签',
      show: true,
      formValue: {
        ...record,
        p_c_id: record.c_id,
        upper_title: record.title,
        title: '',
      },
      addFlag,
      treeCategory,
    }));
  };
  const onEditTag = (record: WebsiteCategory, addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '编辑标签',
      show: true,
      formValue: {
        ...record,
        p_c_id: record.p_c_id,
        title: record.title,
        opt_status: record.opt_status,
      },
      addFlag,
      treeCategory,
    }));
  };
  // 删除
  const delCategoryTag = useMutation({
    mutationFn: async (params: DelCateGoryReq) => {
      const res = await navService.DelCateGory(params);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['WebsiteCategroyList']);
      messageApi.success('删除成功');
    },
    onError: () => {
      messageApi.error('删除失败');
    },
  });
  const onDelTag = (record: WebsiteCategory) => {
    delCategoryTag.mutate({ cid: record.c_id });
  };
  const changeCategoryStatus = useMutation({
    mutationFn: async (params: ChangeCategoryStatusReq) => {
      const res = await navService.OptCateGory(params);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteCategroyList']);
      messageApi.success('修改成功');
    },
    onError: () => {
      messageApi.error('修改失败');
    },
  });
  const onChangeMediaStatus = (checked: boolean, record: WebsiteCategory) => {
    // 修改分发状态逻辑
    // 记得取反
    changeCategoryStatus.mutate({
      cid: record.c_id,
      opt: !!record.opt_status,
    });
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
    },
    onCancel: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
    addFlag: true,
  });

  const onCreateWebsiteCategory = (addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增标签',
      show: true,
      formValue: {
        p_c_id: -1,
        opt_status: '',
        title: '',
      },
      addFlag,
      treeCategory,
    }));
  };
  // 搜索
  // const [searchForm] = Form.useForm();
  // const onSearchFormReset = () => {
  //   searchForm.resetFields();
  // };
  // const [searchFormValues, setSearchFormValues] = useState<SearchFormFieldType>({});
  // const onSearchSubmit = async () => {
  //   console.log(searchFormValues);
  //   const values = await searchForm.validateFields();
  //   console.log(values);
  //   setQuery({ ...values });
  // };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        {/* <Card>
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
        </Card> */}
        <Card
          title="标签管理"
          extra={
            <div>
              {/* <Button onClick={() => onCreateWebsiteCategory(true)}>展开所有子标签</Button>
              <Button className="ml-2" onClick={() => onCreateWebsiteCategory(true)}>
                关闭所有子标签
              </Button> */}
              <Button className="ml-2" type="primary" onClick={() => onCreateWebsiteCategory(true)}>
                新增
              </Button>
            </div>
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
