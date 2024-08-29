import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Modal, Popconfirm, Tag, message } from 'antd';
import { useEffect } from 'react';

import planetService from '@/api/services/planetService';

const { TextArea } = Input;
export interface DetailModelProps {
  title;
  show;
  formValue;
  onOk;
  onCancel;
  // categoryList,
}
// 新增目录标签
function DetailModel({ title, show, formValue, onOk, onCancel }: DetailModelProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const { data: tagList } = useQuery({
    queryKey: ['PlanetTagList', formValue?.group?.group_id],
    queryFn: () => planetService.GetCateGoryTagList(formValue?.group?.group_id),
    enabled: !!formValue?.group?.group_id,
  });
  console.log(formValue);
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      // addCateGoryMutation.mutate(values); // 提交表单数据进行新增
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  const fetchDelCategoryTag = useMutation({
    mutationFn: planetService.DelCateGoryTag,
    onSuccess: () => {
      // queryClient.invalidateQueries(['websiteTagList']);
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
        <Form.Item label="已有标签" name="url">
          {tagList && (
            <div className="mb-4 flex flex-wrap items-center">
              {tagList.map((item: TagInfo) => (
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
                    closable
                    closeIcon={<CloseCircleOutlined />}
                    onClose={(e) => {
                      e.preventDefault();
                      setVisiblePopconfirm(item.id);
                    }}
                    style={{ marginBottom: '8px', marginRight: '8px' }}
                  >
                    {item.title}
                  </Tag>
                </Popconfirm>
              ))}
            </div>
          )}
        </Form.Item>
        <Form.Item label="发布者" name="owner.name">
          <Input />
        </Form.Item>
        <Form.Item label="内容" name="content_text">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="发布者" name="owner.name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default DetailModel;
