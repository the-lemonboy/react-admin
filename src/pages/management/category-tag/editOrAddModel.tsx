import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Modal, Input, Radio, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

import navService, { AddCateGoryReq } from '@/api/services/navService';

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
export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  addFlag: boolean;
  treeCategory: Array<OptionType>;
};

function EditorOrAddModel({
  title,
  show,
  formValue,
  onOk,
  onCancel,
  addFlag,
  treeCategory,
}: EditorOrAddModelProps) {
  const [form] = Form.useForm();
  // const [treeCategory, setTreeCategory] = useState<any>([]);

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const queryClient = useQueryClient();
  const createMediaMutation = useMutation({
    mutationFn: async (params: AddCateGoryReq) => {
      const res = await navService.AddCateGory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteCategroyList']);
      onOk();
    },
    onError: (error) => {
      console.error('Error adding media:', error);
    },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: async (params: AddCateGoryReq) => {
      const res = await navService.UpdateCategory(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['websiteCategroyList']);
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
        updateCategoryMutation.mutate(values);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const onStatusChange = (e: any) => {
    form.setFieldsValue({ opt_status: e.target.value ? 1 : 0 });
  };
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
        <Form.Item<AddCateGoryReq> label="p_c_id" name="p_c_id" rules={[{ required: true }]}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={form.getFieldValue('p_c_id')}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={(value) => form.setFieldsValue({ p_c_id: value })}
            treeData={newTree}
          />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="标题" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<AddCateGoryReq> label="是否禁用" name="opt_status" rules={[{ required: true }]}>
          <Radio.Group onChange={onStatusChange} value={form.getFieldValue('opt_status')}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditorOrAddModel;
