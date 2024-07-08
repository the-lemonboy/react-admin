import { useQuery } from '@tanstack/react-query';
import { Card, Space, message, Switch, Button, TableProps } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import newsService from '@/api/services/newsService';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
interface MediaTableType {
  media_key: string;
  media_title: string;
  opt_status: boolean;
}

export default function ThesaurusTag() {
  const [messageApi, contextHolder] = message.useMessage();
  // const [query, setQuery] = useState<{ limit: number; page: number }>({ limit: 10, page: 1 });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['mediaList'],
    queryFn: () => newsService.GetTheasaurusList(),
  });
  // const [tableParams, setTableParams] = useState<TableParams>({
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //     total: tableList?.count,
  //   },
  // });

  // useEffect(() => {
  //   if (tableList) {
  //     setTableParams((prev) => ({
  //       ...prev,
  //       pagination: {
  //         ...prev.pagination,
  //         total: tableList?.count,
  //       },
  //     }));
  //   }
  // }, [tableList]);

  // const handleTableChange: TableProps<MediaTableType>['onChange'] = (pagination) => {
  //   const current = pagination.current ?? 1;
  //   const pageSize = pagination.pageSize ?? 10;
  //   setQuery({ page: current, limit: pageSize });
  //   setTableParams({ pagination });
  //   if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //     // 清空数据
  //     // setData([]); // 确保这里有数据清空逻辑
  //   }
  // };

  const columns: ColumnsType<MediaTableType> = [
    { title: 'ID', dataIndex: 'media_key', key: 'media_key' },
    { title: '名称', dataIndex: 'media_title', key: 'media_title' },
    {
      title: '分发状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <Switch
          checkedChildren="已分发"
          unCheckedChildren="未分发"
          defaultChecked={record.opt_status}
          onChange={(checked) => onChangeMediaStatus(checked, record)}
        />
      ),
    },
  ];

  const onChangeMediaStatus = (checked: boolean, record: MediaTableType) => {
    // 修改分发状态逻辑
    console.log('Media status changed:', checked, record);
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
            rowKey="media_key"
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
