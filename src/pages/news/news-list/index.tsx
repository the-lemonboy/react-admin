import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Switch, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import newsService from '@/api/services/newsService';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { Media } from '#/entity';

export default function NewsList() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  // const [query, setQuery] = useState<{ limit: number; page: number }>({ limit: 10, page: 1 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['mediaList'],
    queryFn: () => newsService.GetMediaList(),
  });
  const columns: ColumnsType<Media> = [
    { title: 'ID', dataIndex: 'media_key', key: 'media_key' },
    { title: '名称', dataIndex: 'media_title', key: 'media_title' },
    {
      title: '状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record.opt_status}
          onChange={(checked) => onChangeMediaStatus(checked, record)}
        />
      ),
    },
  ];
  const changeMediaStatus = useMutation({
    mutationFn: (params: Media) => {
      const res = newsService.ChangeMediaStatus(params);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaList']);
      messageApi.open({
        type: 'success',
        content: '状态修改成功',
      });
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: '状态修改失败',
      });
    },
  });
  const onChangeMediaStatus = (checked: boolean, record: Media) => {
    // 修改分发状态逻辑
    changeMediaStatus.mutate({
      media_title: record.media_title,
      opt_status: checked,
    });
  };

  const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
    title: '新增媒体',
    show: false,
    formValue: {},
    onOk: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
      // 重新获取数据或更新缓存
      queryClient.invalidateQueries(['mediaList']);
    },
    onCancel: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
    addFlag: true,
  });

  const onCreateMedia = (addFlag: boolean) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '新增媒体',
      show: true,
      formValue: {},
      addFlag,
    }));
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card
          title="媒体管理"
          extra={
            <Button type="primary" onClick={() => onCreateMedia(true)}>
              新增
            </Button>
          }
        >
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={tableList?.data}
            loading={isLoadingList}
            // pagination={tableParams.pagination}
            // onChange={handleTableChange}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}
