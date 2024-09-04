import { CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Modal, Popconfirm, Tag, message } from 'antd';
import { useEffect, useState } from 'react';

import twitterService from '@/api/services/twitterService';

const { TextArea } = Input;

export interface TagInfo {
  id: number;
  c_id: number;
  title: string;
}

export interface DetailModelProps {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
}

function DetailModel({ title, show, formValue, onOk, onCancel }: DetailModelProps) {
  const [form] = Form.useForm();
  const [visiblePopconfirm, setVisiblePopconfirm] = useState<number | null>(null);

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const { data: tagList } = useQuery({
    queryKey: ['TwitterUserTagList', formValue?.author_id],
    queryFn: () => twitterService.GetCateGoryTagList(formValue?.author_id),
    enabled: !!formValue?.author_id,
  });

  const fetchDelCategoryTag = useMutation({
    mutationFn: twitterService.DelCateGoryTag,
    onSuccess: () => {
      message.success('标签删除成功');
    },
    onError: (error) => {
      message.error('删除标签失败');
      console.error('Error deleting category:', error);
    },
  });

  const delCategoryTag = (tagValue: TagInfo) => {
    fetchDelCategoryTag.mutate({ cid: tagValue.c_id });
    setVisiblePopconfirm(null); // 隐藏 Popconfirm
  };

  return (
    <Modal
      title={title}
      open={show}
      onCancel={onCancel}
      footer={null} // 去掉确定按钮
    >
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item label="已有标签" name="url">
          {tagList && (
            <div className="flex flex-wrap items-center">
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
                    style={{ marginRight: '8px' }}
                  >
                    {item.title}
                  </Tag>
                </Popconfirm>
              ))}
            </div>
          )}
        </Form.Item>
      </Form>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled
      >
        <Form.Item label="账号" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="用户名" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="粉丝量" name="followers_count">
          <Input />
        </Form.Item>
        <Form.Item label="关注量" name="following_count">
          <Input />
        </Form.Item>
        <Form.Item label="推特量" name="tweet_count">
          <Input />
        </Form.Item>
        <Form.Item label="位置" name="location">
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="加入时间" name="created_time">
          <Input />
        </Form.Item>
        <Form.Item label="更新时间" name="updated_time">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DetailModel;
