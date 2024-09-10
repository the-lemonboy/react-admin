import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

export interface DetailModelProps {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
}

function DetailModel({ title, show, formValue, onOk, onCancel }: DetailModelProps) {
  const [form] = Form.useForm();
  const [visiblePopconfirm, setVisiblePopconfirm] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    console.log(formValue?.group?.group_id);
  }, [formValue, form]);

  // const { data: tagList } = useQuery({
  //   queryKey: ['PlanetTagList', formValue?.group?.group_id],
  //   queryFn: () => planetService.GetCateGoryTagList(formValue?.group?.group_id),
  //   enabled: !!formValue?.group?.group_id,
  // });

  // const fetchDelCategoryTag = useMutation({
  //   mutationFn: planetService.DelCateGoryTag,
  //   onSuccess: () => {
  //     message.success('标签删除成功');
  //   },
  //   onError: (error) => {
  //     message.error('删除标签失败');
  //     console.error('Error deleting category:', error);
  //   },
  // });

  // const delCategoryTag = (tagValue: any) => {
  //   // TagInfo type can be specified based on actual type
  //   fetchDelCategoryTag.mutate({ cid: tagValue.c_id, wid: tagValue.w_id });
  //   setVisiblePopconfirm(null);
  // };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Handle form submission here
      onOk(); // Call onOk callback after successful submission
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel} footer={null}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled
      >
        <Form.Item label="id" name="id">
          <Input />
        </Form.Item>
        <Form.Item label="发布者" name={['owner', 'name']}>
          <Input />
        </Form.Item>
        <Form.Item label="标题" name="content_search_text">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="阅读次数" name="readers_count">
          <Input />
        </Form.Item>
        <Form.Item label="评论数" name="comments_count">
          <Input />
        </Form.Item>
        <Form.Item label="点赞数" name="rewards_count">
          <Input />
        </Form.Item>
        <Form.Item label="社群名称" name={['group', 'name']}>
          <Input />
        </Form.Item>
        <Form.Item label="发布时间" name="create_time">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DetailModel;
