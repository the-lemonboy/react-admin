import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Switch, Button, TableProps } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import TGService, { AddAreaReq,ChangeAreaStatusReq } from '@/api/services/TGService';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { Theasaurus } from '#/entity';

interface MediaTableType {
  media_key: string;
  media_title: string;
  opt_status: boolean;
}

export default function ThesaurusTag() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  // const [query, setQuery] = useState<{ limit: number; page: number }>({ limit: 10, page: 1 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['planetAreaList'],
    queryFn: () => TGService.GetAreaList(),
  });
  const columns: ColumnsType<MediaTableType> = [
    { title: 'ID', dataIndex: 'area_key', key: 'area_key' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    {
      title: '分发状态',
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
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type='primary' onClick={() => onEditAreaTag(record)}>编辑</Button>
        </div>
      ),
    },
  ];
  const changeTheasaurusStatus = useMutation({
    mutationFn: (params: ChangeAreaStatusReq) => {
      const res = TGService.ChangeAreaStatus(params);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaAreaList']);
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
  const onChangeMediaStatus = (checked: boolean, record: Theasaurus) => {
    // 修改分发状态逻辑
    changeTheasaurusStatus.mutate({ id: record.id, opt_status: checked });
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
    },
    onCancel: () => {
      setEditorOrAddModelProps((prev) => ({
        ...prev,
        show: false,
      }));
    },
    addFlag: true,
  });
  const onEditAreaTag = (record: Theasaurus) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      title: '编辑媒体',
      show: true,
      formValue: record,
      addFlag: false,
    }));
  };
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
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
      </Space>
    </>
  );
}
