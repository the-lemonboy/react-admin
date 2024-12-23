import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Form, Modal, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';

import newsService from '@/api/services/newsService';

import { NewsCategory, Theasaurus } from '#/entity';

export type CategoryType = {
  c_id: string;
  area_id: string;
  area_title: string;
  word_key: string;
  title: string;
  upper_title: string;
  level: number;
  order_n: number;
  p_c_id: string;
  p_c_path: string;
  opt_status: boolean;
  created_at: string;
  updated_at: string;
};
export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  addFlag: boolean;
  // categoryList: Array<CategoryType>;
};

function EditorOrAddModel({
  title,
  show,
  formValue,
  onOk,
  onCancel,
  addFlag,
}: // categoryList,
EditorOrAddModelProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const queryClient = useQueryClient();
  const createMediaMutation = useMutation({
    mutationFn: async (params: NewsCategory) => {
      const res = await newsService.CreateMedia(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['newsCategroyList']);
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
    queryFn: () => newsService.GetTheasaurusList(),
  });
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
            {theasaurusList?.data.map((item: Theasaurus, index: number) => (
              <Select.Option key={index} value={item.id}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<NewsCategory> label="上级ID" name="p_c_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<NewsCategory> label="上级名称" name="upper_title" rules={[{ required: true }]}>
          <Input />
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
