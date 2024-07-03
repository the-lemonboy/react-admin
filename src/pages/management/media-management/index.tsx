import { CloseCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Typography,
  Tag,
  Switch,
  TreeSelect,
  message,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

import navService, {
  AddWebsiteReq,
  GetWebsiteListRes,
  AddCateGoryReq,
} from '@/api/services/navService';
import { Iconify, IconButton } from '@/components/icon';
import { UploadAvatar } from '@/components/upload/upload-avatar';
// import OrganizationChart from './organization-chart';
import { TreeToArray } from '@/utils/tree';

import { Website } from '#/entity';
import type { RadioChangeEvent, GetProp, TableProps } from 'antd';
// --------------------分页类型
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
type OptionType = {
  a_id: string;
  c_id: string;
  created_at: string;
  del_tag: number;
  id: number;
  level: number;
  opt_status: number;
  order_n: number;
  p_c_path: string;
  p_c_id: string;
  updated_at: string;
  title: string;
  word_key: string;
  upper_title: string;
  children?: OptionType[];
};
// ------------
type SearchFormFieldType = Pick<Website, 'title'>;
export default function NavWebsitePage() {
  const [messageApi, contextHolder] = message.useMessage();
  // 多级单选框
  // const { data: optionsDataList, isLoading: isLoadingCg } = useQuery<OptionType[], Error>({
  //   queryKey: ['websiteOptions'],
  //   queryFn: async () => {
  //     console.log('this is data');
  //     const res = await navService.CateGoryList();
  //     console.log(res, 'this is data');
  //     return res; // 返回响应对象的数据部分，确保返回的是 OptionType[] 类型的数组
  //   },
  // });
  // console.log(optionsDataList);
  const [optionsDataList, setOptionsDataList] = useState([]);
  useEffect(() => {
    navService.CateGoryList().then((res) => {
      setOptionsDataList(res);
    });
  }, []);
  const fetchWebsiteList = async (params: GetWebsiteListRes) => {
    const res = await navService.WebsiteList(params);
    return res;
  };
  const [query, setQuery] = useState<GetWebsiteListRes>({ limit: 10, page: 1 });

  // 使用 useQuery 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ['websiteList', query],
    queryFn: () => fetchWebsiteList(query),
  });
  // 分页
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
    console.log(pagination);
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setQuery({ page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  // 新建网站
  // const [websiteData, setWebsiteData] = useState<Website[]>([]);
  // 新增or编辑弹框
  const [searchForm] = Form.useForm();
  const [websiteModalProps, setWebsiteModalProps] = useState<WebsiteModalProps>({
    formValue: {
      hash_key: '',
      description: '',
      icon: '',
      link: '',
      title: '',
    },
    title: 'New',
    show: false,
    onOk: () => {
      setWebsiteModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setWebsiteModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  const [editorTagModalProps, setEditorTagModalProps] = useState<EdiortagModalProps>({
    formValue: {
      description: '',
      icon: '',
      link: '',
      title: '',
    },
    title: '编辑网站标签',
    show: false,
    onOk: () => {
      setEditorTagModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setEditorTagModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  // 新增目录标签
  const [addTagModelProps, setAddTagModelProps] = useState<AddCategoryModelProps>({
    formValue: {
      opt_status: 0,
      p_c_id: '',
      title: '',
    },
    title: '新增目录标签',
    show: false,
    onOk: () => {
      setAddTagModelProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setAddTagModelProps((prev) => ({ ...prev, show: false }));
    },
    categoryList: [],
  }); // [AddCategoryModelProps]
  // 新增网站的标签
  const [addWebsiteTagModelProps, setAddWebsiteTagModelProps] = useState<AddWebsiteTagModelProps>({
    formValue: {
      description: '',
      icon: '',
      link: '',
      title: '',
      website_id: '',
    },
    title: '新增网站标签',
    show: false,
    onOk: () => {
      setAddWebsiteTagModelProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setAddWebsiteTagModelProps((prev) => ({ ...prev, show: false }));
    },
  });
  const columns: ColumnsType<Website> = [
    { title: '名称', dataIndex: 'title', align: 'center', width: 200 },
    {
      title: 'Icon',
      dataIndex: 'icon',
      align: 'center',
      width: 80,
      render: (text: string) => <img src={text} alt="icon" style={{ width: 30, height: 30 }} />,
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
      width: 300,
    },
    { title: '链接', dataIndex: 'link', align: 'center', width: 300 },
    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onCreateWebsiteTag(record.hash_key)}>
            <Iconify icon="ph:tag-fill" size={18} />
          </IconButton>
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="Delete the Website"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => onDelWebsite(record)}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<Website> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  // const { data } = useQuery({
  //   queryKey: ['orgs'],
  //   queryFn: orgService.getOrgList,
  // });

  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const onCreate = () => {
    setWebsiteModalProps((prev) => ({
      ...prev,
      show: true,
      title: 'Create New',
      formValue: {
        ...prev.formValue,
        description: '',
        icon: '',
        link: '',
        title: '',
      },
    }));
  };
  const onCreateCategory = () => {
    setAddTagModelProps((prev) => ({
      ...prev,
      show: true,
      title: '新增目录标签',
      formValue: {
        ...prev.formValue,
        opt_status: 0,
        p_c_id: '',
        title: '',
      },
      categoryList: optionsDataList,
    }));
  };
  const onCreateWebsiteTag = (hash_key: string) => {
    setAddTagModelProps((prev) => ({
      ...prev,
      show: true,
      title: '新增目录标签',
      wid: hash_key,
      formValue: {
        ...prev.formValue,
        opt_status: 0,
        p_c_id: '',
        title: '',
      },
      categoryList: optionsDataList,
    }));
  };
  const onEdit = (formValue: Website) => {
    setWebsiteModalProps((prev) => ({
      ...prev,
      show: true,
      title: 'Edit',
      formValue,
    }));
  };
  // type WebsiteTag = {

  // }
  const onEditTag = (formValue: Website) => {};
  const queryClient = useQueryClient();
  // 使用 useMutation 钩子处理删除操作
  const delWebsitemutation = useMutation({
    mutationFn: navService.DelWebSite,
    onSuccess: () => {
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['websiteList']);
    },
    onError: (error) => {
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });

  // 事件处理函数，调用删除操作
  const onDelWebsite = (formValue: Website) => {
    const delData = { wid: formValue.hash_key }; // 替换为实际的数据
    delWebsitemutation.mutate(delData);
  };
  // 标签事件
  const [keyword, setValue] = useState(1);
  // -------------删除目录标签 start
  const [visiblePopconfirm, setVisiblePopconfirm] = useState<number | null>(null);
  const handleTagClose = (e: React.MouseEvent<HTMLElement>, item: OptionType) => {
    e.preventDefault(); // Prevent the default Tag close behavior
    e.stopPropagation(); // Prevent the event from bubbling up
    setVisiblePopconfirm(item.id); // Show the Popconfirm for the clicked Tag
  };
  const fetchDelCategoryTag = useMutation({
    mutationFn: navService.DelCateGory,
    onSuccess: () => {
      // queryClient.invalidateQueries(['websiteList']);
      console.log('删除成功');
      messageApi.open({
        type: 'success',
        content: '标签删除成功',
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
  const onChangeTag = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const delCategoryTag = (tagValue: OptionType) => {
    // delCategoryTag(item); // Call the delete function
    fetchDelCategoryTag.mutate({ cid: tagValue.c_id });
    setVisiblePopconfirm(null); // Hide the Popconfirm
    console.log(tagValue);
  };
  const cancelCategoryTagPop = () => {
    setVisiblePopconfirm(null);
  };
  const handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      setVisiblePopconfirm(null); // Hide Popconfirm when clicking outside
    }
  };
  // --------------删除目录标签 end
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        {/* <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="Name" name="name" className="!mb-0">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item<SearchFormFieldType> label="Status" name="status" className="!mb-0">
                <Select>
                  <Select.Option value="enable">
                    <ProTag color="success">Enable</ProTag>
                  </Select.Option>
                  <Select.Option value="disable">
                    <ProTag color="error">Disable</ProTag>
                  </Select.Option>
                </Select>
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
      </Card> */}
        <Card
          title="目录操作"
          extra={
            <Button type="primary" onClick={onCreateCategory}>
              新增
            </Button>
          }
        >
          {optionsDataList &&
            optionsDataList.filter((item: OptionType) => item.level === 0).length > 0 && (
              <div className="mb-4 flex flex-wrap items-center">
                <p className="mr-3 whitespace-nowrap text-base font-bold">关键词1</p>
                {optionsDataList
                  .filter((item: OptionType) => item.level === 0)
                  .map((item: OptionType) => (
                    <Popconfirm
                      key={item.id} // Use a unique identifier if available
                      title="删除标签"
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                      open={visiblePopconfirm === item.id}
                      onConfirm={() => delCategoryTag(item)}
                      onCancel={cancelCategoryTagPop}
                      onOpenChange={(visible) => handleVisibleChange(visible)}
                    >
                      <Tag
                        closable
                        key={item.id} // Use a unique identifier if available
                        closeIcon={<CloseCircleOutlined />}
                        onClose={(e) => handleTagClose(e, item)}
                        style={{ marginBottom: '8px', marginRight: '8px' }}
                      >
                        {item.title}
                      </Tag>
                    </Popconfirm>
                  ))}
              </div>
            )}

          {optionsDataList &&
            optionsDataList.filter((item: OptionType) => item.level === 1).length > 0 && (
              <div className="mb-4 flex flex-wrap items-center">
                <p className="mr-3 whitespace-nowrap text-base font-bold">关键词2</p>
                {optionsDataList
                  .filter((item: OptionType) => item.level === 1)
                  .map((item: OptionType) => (
                    <Popconfirm
                      key={item.id} // Use a unique identifier if available
                      title="删除标签"
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                      open={visiblePopconfirm === item.id}
                      onConfirm={() => delCategoryTag(item)}
                      onCancel={cancelCategoryTagPop}
                      onOpenChange={(visible) => handleVisibleChange(visible)}
                    >
                      <Tag
                        closable
                        key={item.id} // Use a unique identifier if available
                        closeIcon={<CloseCircleOutlined />}
                        onClose={(e) => handleTagClose(e, item)}
                        style={{ marginBottom: '8px', marginRight: '8px' }}
                      >
                        {item.title}
                      </Tag>
                    </Popconfirm>
                  ))}
              </div>
            )}
          {optionsDataList &&
            optionsDataList.filter((item: OptionType) => item.level === 2).length > 0 && (
              <div className="mb-4 flex flex-wrap items-center">
                <p className="mr-3 whitespace-nowrap text-base font-bold">关键词3</p>
                {optionsDataList
                  .filter((item: OptionType) => item.level === 2)
                  .map((item: OptionType) => (
                    <Popconfirm
                      key={item.id} // Use a unique identifier if available
                      title="删除标签"
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                      open={visiblePopconfirm === item.id}
                      onConfirm={() => delCategoryTag(item)}
                      onCancel={cancelCategoryTagPop}
                      onOpenChange={(visible) => handleVisibleChange(visible)}
                    >
                      <Tag
                        closable
                        key={item.id} // Use a unique identifier if available
                        closeIcon={<CloseCircleOutlined />}
                        onClose={(e) => handleTagClose(e, item)}
                        style={{ marginBottom: '8px', marginRight: '8px' }}
                      >
                        {item.title}
                      </Tag>
                    </Popconfirm>
                  ))}
              </div>
            )}
          {/* {optionsDataList &&
          optionsDataList.filter((item: OptionType) => item.level === 1).length > 0 && (
            <div className="flex-start mb-4 flex items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">关键词2</p>
              <Radio.Group onChange={onChangeTag} value={keyword}>
                {optionsDataList
                  .filter((item: OptionType) => item.level === 1)
                  .map((item: OptionType, index: number) => (
                    <Radio key={index} value={item.c_id}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            </div>
          )}
        {optionsDataList &&
          optionsDataList.filter((item: OptionType) => item.level === 2).length > 0 && (
            <div className="flex items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">关键词3</p>
              <Radio.Group onChange={onChangeTag} value={keyword}>
                {optionsDataList
                  .filter((item: OptionType) => item.level === 2)
                  .map((item: OptionType, index: number) => (
                    <Radio key={index} value={item.c_id}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            </div>
          )} */}
        </Card>
        <Card
          title="Website List"
          extra={
            <Button type="primary" onClick={onCreate}>
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
            rowSelection={{ ...rowSelection }}
            loading={isLoading}
            onChange={handleTableChange}
          />
        </Card>

        {/* <Card title="Organization Chart">
        <OrganizationChart organizations={data} />
      </Card> */}

        <WebsiteModal {...websiteModalProps} />
        <EditorTagModal {...editorTagModalProps} />
        <AddCateGoryModel {...addTagModelProps} />
        {/* <EditorTagModal {... editTagModelProps} /> */}
      </Space>
    </>
  );
}

type WebsiteModalProps = {
  formValue: Website;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};

function WebsiteModal({ title, show, formValue, onOk, onCancel }: WebsiteModalProps) {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const boxPlaceHolder = (
    <div className="flex flex-col">
      <Iconify icon="hugeicons:image-upload" size={40} />
      <Typography.Text type="secondary" className="">
        Upload File
      </Typography.Text>
    </div>
  );
  const queryClient = useQueryClient();
  const addWebsiteMutation = useMutation({
    mutationFn: async (params: AddWebsiteReq) => {
      const res = await navService.AddWebsite(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error adding website:', error); // 处理错误
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      addWebsiteMutation.mutate(values); // 提交表单数据进行新增
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
        <Form.Item<Website> label="标题" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<Website> label="链接" name="link" required>
          <Input />
        </Form.Item>
        <Form.Item<Website> label="描述" name="description" required>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item<Website> label="icon" name="icon" required>
          <UploadAvatar action="/api/api/nav/website/icon/upload" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

type AddCategoryModelProps = {
  formValue: AddCateGoryReq;
  title: String;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  categoryList: Array<OptionType>;
};

// 新增目录标签
function AddCateGoryModel({
  title,
  show,
  formValue,
  onOk,
  onCancel,
  categoryList,
}: AddCategoryModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const onStatusChange = (checked: boolean) => {
    if (checked) formValue.opt_status = 1;
    else formValue.opt_status = 0;
  };
  const treeCategory = TreeToArray(categoryList).map((item) => ({
    title: item.title,
    value: item.c_id,
    key: item.c_id,
    children: item.children
      ? item.children.map((child) => ({
          title: child.title,
          value: child.c_id,
          key: child.c_id,
        }))
      : [],
  }));
  const SelectParent = (newValue: string) => {
    formValue.p_c_id = newValue;
  };
  // 新增
  const queryClient = useQueryClient();
  const addCateGoryMutation = useMutation({
    mutationFn: async (params: AddCateGoryReq) => {
      const res = await navService.AddCateGory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categoryList']); // 成功新增后，重新获取数据或更新缓存
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      console.error('Error adding website:', error); // 处理错误
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      addCateGoryMutation.mutate(values); // 提交表单数据进行新增
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
        <Form.Item<AddCateGoryReq> label="父目录" name="p_c_id" required>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={formValue.p_c_id}
            // lable={}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={SelectParent}
            treeData={treeCategory}
          />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="标签名" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="是否禁用" name="opt_status" required>
          <Switch onChange={onStatusChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
// 网站标签删除和新增
type EditTagModalProps = {
  wid: string;
  formValue: any;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  categoryList: Array<OptionType>;
};
function EditorTagModal({
  wid,
  title,
  show,
  formValue,
  onOk,
  onCancel,
  categoryList,
}: EditTagModalProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  // const treeCategory = TreeToArray(categoryList).map((item) => ({
  //   title: item.title,
  //   value: item.c_id,
  //   key: item.c_id,
  //   children: item.children
  //     ? item.children.map((child) => ({
  //         title: child.title,
  //         value: child.c_id,
  //         key: child.c_id,
  //       }))
  //     : [],
  // }));
  const SelectParent = (newValue: string) => {
    formValue.p_c_id = newValue;
  };
  const { data } = useQuery({
    queryKey: ['websiteTagList', wid], // 将 wid 作为查询参数的一部分
    queryFn: async () => {
      const res = await navService.GetWebsiteTagList({ w_id: wid }); // 在服务函数中传入 wid
      return res.data;
    },
  });
  const handleOk = async () => {};
  console.log(data, 'this is web');
  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        {/* <Form.Item<Website> label="已有标签" name="title" required>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={formValue.p_c_id}
            // lable={}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={SelectParent}
            treeData={treeCategory}
          />
        </Form.Item> */}
        <Form.Item<Website> label="链接" name="link" required>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
