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
  Tag,
  Switch,
  TreeSelect,
  message,
  Tooltip,
  Col,
  Row,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

import navService, {
  AddWebsiteReq,
  AddCateGoryReq,
  AddTagReq,
  SearchWebsiteReq,
} from '@/api/services/navService';
import { Iconify, IconButton } from '@/components/icon';
import { UploadAvatar } from '@/components/upload/upload-avatar';
// import OrganizationChart from './organization-chart';
import { ArrayToTree } from '@/utils/tree';

import { Website } from '#/entity';
import type { GetProp, TableProps } from 'antd';
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
// type SearchFormFieldType = Pick<Website, 'title'>;
export default function NavWebsitePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [optionsDataList, setOptionsDataList] = useState([]);
  useEffect(() => {
    navService.CateGoryList().then((res) => {
      setOptionsDataList(res);
    });
  }, []);
  const fetchWebsiteList = async (params: SearchWebsiteReq) => {
    const res = await navService.SearchWebsite(params);
    return res;
  };
  const [query, setQuery] = useState<SearchWebsiteReq>({ limit: 20, page: 1 });

  // 使用 useQuery 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ['websiteList', query],
    queryFn: () => fetchWebsiteList(query),
  });
  // 分页
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
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
    const pageSize = pagination.pageSize ?? 20;
    setQuery({ page: current, limit: pageSize });
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  // 新建网站
  // const [websiteData, setWebsiteData] = useState<Website[]>([]);
  // 新增or编辑弹框
  // const [searchForm] = Form.useForm();
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
  // 新增网站的标签和删除网站的标签
  const [editorTagModalProps, setEditorTagModalProps] = useState<EditTagModalProps>({
    formValue: {
      description: '',
      icon: '',
      link: '',
      title: '',
    },
    wid: '',
    title: '编辑网站标签',
    show: false,
    onOk: () => {
      setEditorTagModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setEditorTagModalProps((prev) => ({ ...prev, show: false }));
    },
    categoryList: [],
  });
  // 新增目录标签
  const [addCategoryTagModelProps, setAddTagModelProps] = useState<AddCategoryModelProps>({
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
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
    },
    {
      title: '描述',
      dataIndex: 'content_search_text',
      key: 'content_search_text',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={record.description}>
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
            {record.description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '链接',
      dataIndex: 'link',
      align: 'center',
      width: 200,
      render: (link: string) => {
        return (
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        );
      },
    },
    {
      title: '标签',
      dataIndex: 'group',
      key: 'group',
      width: 300,
      // align: 'center',
      render: (_, record) => {
        const categories = record?.category;
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
            title="确认删除"
            okText="是"
            cancelText="否"
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
        hash_key: '',
        created_at: '',
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
    setEditorTagModalProps((prev) => ({
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
  // const onChangeTag = (e: RadioChangeEvent) => {
  //   console.log('radio checked', e.target.value);
  //   setValue(e.target.value);
  // };
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
      messageApi.open({
        type: 'success',
        content: '标签删除成功',
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
  const delCategoryTag = (tagValue: OptionType) => {
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
  // 搜索
  const [searchForm] = Form.useForm();
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };
  const [searchFormValues, setSearchFormValues] = useState<SearchTGReq>({});
  const onSearchSubmit = async () => {
    const values = await searchForm.validateFields();
    setQuery({ ...values, page: 1, limit: 20 });
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm} initialValues={searchFormValues}>
            <Row gutter={[16, 16]}>
              <Col span={24} lg={6}>
                <Form.Item label="名称" name="title" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={6}>
                <Form.Item label="描述" name="description" className="!mb-0">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} lg={12}>
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
                      okText="是"
                      cancelText="否"
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
                      okText="是"
                      cancelText="否"
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
                      okText="是"
                      cancelText="否"
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
            loading={isLoading}
            onChange={handleTableChange}
          />
        </Card>

        {/* <Card title="Organization Chart">
        <OrganizationChart organizations={data} />
      </Card> */}

        <WebsiteModal {...websiteModalProps} />
        <EditorTagModal {...editorTagModalProps} />
        <AddCateGoryModel {...addCategoryTagModelProps} />
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
  console.log(formValue);
  const queryClient = useQueryClient();
  const addWebsiteMutation = useMutation({
    mutationFn: async (params: AddWebsiteReq) => {
      const res = await navService.AddWebsite(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteList']); // 成功新增后，重新获取数据或更新缓存
      message.success('添加网站成功');
      onOk(); // 调用父组件传递的 onOk 函数
    },
    onError: (error) => {
      message.error('添加网站失败');
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
  const handleImageUrlChange = (url: string) => {
    form.setFieldsValue({ icon: url }); // 更新表单中的 icon 字段值
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
          <UploadAvatar
            action="api/nav/website/icon/upload"
            onImageUrlChange={handleImageUrlChange}
          />
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
  const treeCategory = ArrayToTree(categoryList).map((item) => ({
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
type TagInfo = {
  area_id: string;
  c_id: string;
  id: string;
  p_c_path: string;
  p_c_title: string;
  title: string;
  w_id: string;
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
  const queryClient = useQueryClient();

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const [tagValues, setAddTagValues] = useState<string[]>([]);
  const [visiblePopconfirm, setVisiblePopconfirm] = useState<number | null>(null);

  const treeCategory = ArrayToTree(categoryList).map((item) => ({
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

  const SelectParent = (newValue: string[]) => {
    setAddTagValues(newValue);
  };

  const { SHOW_PARENT } = TreeSelect;

  const { data: websiteTagList } = useQuery({
    queryKey: ['websiteTagList', { w_id: wid }],
    queryFn: async () => {
      const res = await navService.GetWebsiteTagList({ w_id: wid });
      return res;
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async (params: AddTagReq) => {
      const res = await navService.AddTag(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteTagList']);
      message.success('标签新增成功');
      onOk();
    },
    onError: (error) => {
      message.error('新增标签失败');
      console.error('Error adding category:', error);
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        wid,
        cids: values.cids,
      };
      addTagMutation.mutate(params);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const fetchDelCategoryTag = useMutation({
    mutationFn: navService.DelTag,
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteTagList']);
      message.success('标签删除成功');
    },
    onError: (error) => {
      message.error('删除标签失败');
      console.error('Error deleting category:', error);
    },
  });

  const delCategoryTag = (tagValue: TagInfo) => {
    fetchDelCategoryTag.mutate({ cid: tagValue.c_id, wid: tagValue.w_id });
    setVisiblePopconfirm(null); // Hide the Popconfirm
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
        <Form.Item label="新增标签" name="cids" required>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={tagValues}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={SelectParent}
            treeData={treeCategory}
          />
        </Form.Item>
        <Form.Item label="已有标签" name="url">
          {websiteTagList && (
            <div className=" flex flex-wrap items-center">
              {websiteTagList.map((item: TagInfo) => (
                <Popconfirm
                  key={item.id}
                  title="确定删除这个标签吗?"
                  okText="确定"
                  cancelText="取消"
                  placement="left"
                  open={visiblePopconfirm === item.id}
                  onConfirm={() => delCategoryTag(item)}
                  onCancel={() => setVisiblePopconfirm(null)}
                >
                  <Tag
                    className="m-0"
                    closable
                    closeIcon={<CloseCircleOutlined />}
                    onClose={(e) => {
                      e.preventDefault();
                      setVisiblePopconfirm(item.id);
                    }}
                  >
                    {item.title}
                  </Tag>
                </Popconfirm>
              ))}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
