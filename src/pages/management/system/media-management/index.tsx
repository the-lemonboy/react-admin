import { CloseCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
  Tag,
  Switch,
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
import { UploadImage } from '@/components/upload';
import ProTag from '@/theme/antd/components/tag';
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
  area_id: String;
  c_id: String;
  created_at: String;
  del_tag: Number;
  id: Number;
  level: Number;
  opt_status: Number;
  order_n: Number;
  p_c_id: String;
  p_c_path: String;
  title: String;
  updated_at: String;
  upperTitle: String;
  word_key: String;
};
// ------------
type SearchFormFieldType = Pick<Website, 'title'>;
export default function OrganizationPage() {
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
  // 表格数据数据
  const fetchWebsiteList = async (params: GetWebsiteListRes) => {
    const res = await navService.WebsiteList(params);
    return res.data;
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
      total: 400,
    },
  });
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
  const [addTagModelProps, setAddTagModelProps] = useState<AddTagModelProps>({
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
  }); // [AddTagModelProps]
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
          <IconButton onClick={() => onEditTag(record)}>
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
            onConfirm={() => onDel(record)}
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
    console.log(optionsDataList, 'this is optionsDataList');
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
  const onDel = (formValue: Website) => {
    console.log(formValue);
    const data = { wid: formValue.id }; // 替换为实际的数据
    delWebsitemutation.mutate(data);
  };
  // 标签事件
  const [keyword, setValue] = useState(1);
  const onChangeTag = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
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
      </Card>
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
                .map((item: OptionType, index: number) => (
                  <Tag
                    key={index}
                    closeIcon={<CloseCircleOutlined />}
                    onClose={() => console.log(`Closing tag ${item.title}`)}
                    style={{ marginBottom: '8px', marginRight: '8px' }}
                  >
                    {item.title}
                  </Tag>
                ))}
            </div>
          )}
        {optionsDataList &&
          optionsDataList.filter((item: OptionType) => item.level === 1).length > 0 && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">关键词2</p>
              {optionsDataList
                .filter((item: OptionType) => item.level === 1)
                .map((item: OptionType, index: number) => (
                  <Tag
                    key={index}
                    closeIcon={<CloseCircleOutlined />}
                    onClose={() => console.log(`Closing tag ${item.title}`)}
                    style={{ marginBottom: '8px', marginRight: '8px' }}
                  >
                    {item.title}
                  </Tag>
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
          dataSource={data}
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
      <AddTagModel {...addTagModelProps} />
    </Space>
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
  const fetchWeAddWebsite = async (params: AddWebsiteReq) => {
    const res = await navService.AddWebsite(params);
    return res.data;
  };
  const addWebsiteMutation = useMutation(fetchWeAddWebsite, {
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
          <Input />
        </Form.Item>
        <Form.Item<Website> label="icon" name="desc" required>
          <UploadImage placeholder={boxPlaceHolder} action="/api/nav/website/icon/upload" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
type EdiortagModalProps = {
  formValue: Tag;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
function EditorTagModal({ title, show, formValue, onOk, onCancel }: EditorTagModalProps) {
  return (
    <Modal title={title} open={show} onOk={onOk} onCancel={onCancel}>
      <div className="h-20 w-1/2" />
    </Modal>
  );
}

type AddTagModelProps = {
  formValue: AddCateGoryReq;
  title: String;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  categoryList: Array<OptionType>;
};
function AddTagModel({ title, show, formValue, onOk, onCancel, categoryList }: AddTagModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      // addWebsiteMutation.mutate(values); // 提交表单数据进行新增
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };
  // const [parentTag, setParentTag] = useState([]);
  // const
  const treeCategroy = TreeToArray(categoryList, -1);
  console.log(treeCategroy, 'this is tree');
  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<AddCateGoryReq> label="父目录" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="标签名" name="title" required>
          <Input />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="标签名" name="title" required>
          <Switch defaultChecked onChange={onChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
