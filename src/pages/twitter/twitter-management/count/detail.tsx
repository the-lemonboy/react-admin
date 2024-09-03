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
    queryKey: ['PlanetTagList', formValue?.author_id],
    queryFn: () => twitterService.GetCateGoryTagList(formValue?.author_id),
    enabled: !!formValue?.author_id,
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      // 在此处理提交逻辑
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

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
