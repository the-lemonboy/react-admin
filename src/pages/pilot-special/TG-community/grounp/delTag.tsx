import { CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal, Popconfirm, Tag, message } from 'antd';
import { useEffect, useState } from 'react';

import TGService from '@/api/services/TGService';

import { CategroyTag } from '../../types';

const { TextArea } = Input;

export interface DelTagModelProps {
  title: string;
  show: boolean;
  formValue: any;
  onOk: VoidFunction;
  onCancel: VoidFunction;
}

// 新增目录标签
function DelTagModel({ title, show, formValue, onOk, onCancel }: DelTagModelProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const { data: tagList } = useQuery({
    queryKey: ['TGTagList', formValue?.group_id],
    queryFn: () => TGService.GetCateGoryTagList(formValue?.group_id),
    enabled: !!formValue?.group_id,
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单所有字段的值
      // addCateGoryMutation.mutate(values); // 提交表单数据进行新增
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const fetchDelCategoryTag = useMutation({
    mutationFn: ({ group_id, category_id }: { group_id: string; category_id: string }) =>
      TGService.DelCateGoryTag(category_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['PlanetTagList']);
      message.success('标签删除成功');
    },
    onError: (error) => {
      message.error('删除标签失败');
      console.error('Error deleting category:', error);
    },
  });

  const [visiblePopconfirm, setVisiblePopconfirm] = useState<string | null>(null);

  const delCategoryTag = (tagValue: CategroyTag) => {
    console.log(formValue, tagValue);
    fetchDelCategoryTag.mutate({ group_id: formValue.id, category_id: tagValue.area_id });
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
        {/* <Form.Item label="已有标签" name="url">
          {tagList && (
            <div className="flex flex-wrap items-center">
              {tagList.map((item: CategroyTag) => (
                <Popconfirm
                  key={item.id}
                  title="确定删除这个标签吗?"
                  okText="确定"
                  cancelText="取消"
                  placement="left"
                  open={visiblePopconfirm === item.area_id}
                  onConfirm={() => delCategoryTag(item)}
                  onCancel={() => setVisiblePopconfirm(null)}
                >
                  <Tag
                    className="m-0"
                    closable
                    closeIcon={<CloseCircleOutlined />}
                    onClose={(e) => {
                      e.preventDefault();
                      setVisiblePopconfirm(item.area_id);
                    }}
                  >
                    {item.area_title}
                  </Tag>
                </Popconfirm>
              ))}
            </div>
          )}
        </Form.Item> */}
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

export default DelTagModel;
