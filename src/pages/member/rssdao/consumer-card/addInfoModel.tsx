import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Modal, Input, Radio } from 'antd';
import { useEffect } from 'react';

import couponService, { ChangeCouponStatusReq } from '@/api/services/couponService';

import { CouponTableType } from '#/entity';

export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};

function AddInfoModel({ title, show, formValue, onOk, onCancel }: EditorOrAddModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const queryClient = useQueryClient();
  const changeDistributedMutation = useMutation({
    mutationFn: async (params: ChangeCouponStatusReq) => {
      const res = await couponService.ChangeCouponStatus(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['couponList']);
      onOk();
      // message.success('修改成功');
    },
    onError: (err: any) => {
      // queryClient.invalidateQueries(['couponList']);
      // messageApi.error(err.message);
      onCancel();
    },
  });

  const handleOk = async () => {
    const values = await form.validateFields();
    console.log(values);
    changeDistributedMutation.mutate(values);
  };

  const handleOptStatusChange = (e: any) => {
    console.log('radio checked', e.target);
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
        <Form.Item<ChangeCouponStatusReq> label="id" name="c_no" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<ChangeCouponStatusReq> label="手机号" name="account" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<ChangeCouponStatusReq>
          label="是否启用"
          name="distributed"
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

export default AddInfoModel;
