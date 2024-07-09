import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Modal, Input, Radio } from 'antd';
import { useEffect } from 'react';

import newsService, { AddTheasaurusReq } from '@/api/services/newsService';

export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  addFlag: boolean;
};

function EditorOrAddModel({
  title,
  show,
  formValue,
  onOk,
  onCancel,
  addFlag,
}: EditorOrAddModelProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const queryClient = useQueryClient();
  const createMediaMutation = useMutation({
    mutationFn: async (params: AddTheasaurusReq) => {
      const res = await newsService.AddTheasaurus(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaAreaList']);
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
        createMediaMutation.mutate({
          title: values.title,
          opt_status: values.opt_status,
        });
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

  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<AddTheasaurusReq> label="名称" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<AddTheasaurusReq>
          label="是否禁用"
          name="opt_status"
          rules={[{ required: true }]}
        >
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
