import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Form, Modal, Input, Radio, Select, TreeSelect } from 'antd';
import { useEffect } from 'react';

import planetService, { AddCategoryReq } from '@/api/services/planetService';

import { NewsCategory, Theasaurus } from '#/entity';

export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  addFlag: boolean;
  treeCategory: NewsCategory; // 后面改
  addChildFlag: boolean;
  // categoryList: Array<CategoryType>;
};
interface TreeNode<T> {
  children?: TreeNode<T>[];
}
interface TreeCategory extends NewsCategory {
  children?: TreeCategory[];
}
interface NewTreeNode {
  title: string;
  value: string;
  key: string;
  children?: NewTreeNode[];
}
interface DefaultOptionType {
  title: string;
  value: string;
  key: string;
  children?: DefaultOptionType[];
}
function EditorOrAddModel({
  title,
  show,
  formValue,
  onOk,
  onCancel,
  addFlag,
  treeCategory, // 后面改
  addChildFlag,
}: // categoryList,
EditorOrAddModelProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const queryClient = useQueryClient();
  const createMediaMutation = useMutation({
    mutationFn: async (params: AddCategoryReq) => {
      const res = await planetService.AddCateGory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['PlanetCategroyList']);
      onOk();
    },
    onError: (error) => {
      console.error('Error adding media:', error);
    },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: async (params: AddCategoryReq) => {
      const res = await planetService.UpdateCategory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['PlanetCategroyList']);
      onOk();
    },
    onError: (error) => {
      console.error('Error adding media:', error);
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (addFlag) {
        createMediaMutation.mutate(values);
      } else {
        // handle update logic here
        updateCategoryMutation.mutate(values);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleOptStatusChange = (e: any) => {
    form.setFieldsValue({ opt_status: e.target.value });
  };
  const { data: theasaurusList } = useQuery({
    queryKey: ['theasaurusList'],
    queryFn: () => planetService.GetAreaList(),
  });

  // tree
  const SelectParent = (newValue: string[]) => {
    form.setFieldsValue({ p_c_id: newValue });
  };
  const transformTree = (tree: TreeCategory[]): NewTreeNode[] => {
    return tree?.map((item) => {
      const newNode: NewTreeNode = {
        title: item.title,
        value: item.c_id,
        key: item.c_id,
      };
      if (item.children && item.children.length > 0) {
        newNode.children = transformTree(item.children);
      }
      return newNode;
    });
  };
  const newTree: DefaultOptionType[] = transformTree(treeCategory);
  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<NewsCategory> label="所属板块" name="area_id">
          <Select>
            {theasaurusList?.data.map((item: Theasaurus, index) => (
              <Select.Option key={index} value={item.id}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<NewsCategory> label="上级ID" name="p_c_id" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item<NewsCategory> label="上级名称" name="upper_title" rules={[{ required: true }]}>
          {addChildFlag ? (
            <Input disabled />
          ) : (
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={formValue.p_c_id}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={SelectParent}
              treeData={newTree}
            />
          )}
        </Form.Item>
        <Form.Item<NewsCategory> label="标题" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<NewsCategory> label="是否禁用" name="opt_status" rules={[{ required: true }]}>
          <Radio.Group onChange={handleOptStatusChange} value={form.getFieldValue('opt_status')}>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditorOrAddModel;
