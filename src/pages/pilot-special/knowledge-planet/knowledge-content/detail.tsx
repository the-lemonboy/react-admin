import { CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Modal, Popconfirm, Tag, message } from 'antd';
import { useEffect, useState } from 'react';

import planetService from '@/api/services/planetService';

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

  const { data: tagList } = useQuery({
    queryKey: ['PlanetTagList', formValue?.group?.group_id],
    queryFn: () => planetService.GetCateGoryTagList(formValue?.group?.group_id),
    enabled: !!formValue?.group?.group_id,
  });

  const fetchDelCategoryTag = useMutation({
    mutationFn: planetService.DelCateGoryTag,
    onSuccess: () => {
      message.success('标签删除成功');
    },
    onError: (error) => {
      message.error('删除标签失败');
      console.error('Error deleting category:', error);
    },
  });

  const delCategoryTag = (tagValue: any) => {
    // TagInfo type can be specified based on actual type
    fetchDelCategoryTag.mutate({ cid: tagValue.c_id, wid: tagValue.w_id });
    setVisiblePopconfirm(null);
  };

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
    <Modal title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item label="已有标签" name="tags">
          {tagList && (
            <div className="flex flex-wrap items-center">
              {tagList.map((item: any) => (
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
                    style={{ marginRight: '8px' }}
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
      </Form>
    </Modal>
  );
}

export default DetailModel;
