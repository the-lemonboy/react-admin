import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Button, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import planetService, { GetGroupListReq } from '@/api/services/planetService';

import DelTagModel, { DelTagModelProps } from './delTag';
import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { PlanetKnowledge } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function KnowledgeGrounp() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [articelQuery, setArticelQuery] = useState<GetGroupListReq>({
    limit: 10,
    page: 1,
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['GrounpList', articelQuery],
    queryFn: () => planetService.GetGroupList(articelQuery),
  });
  // 分页
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: tableList?.count,
    },
  });
  useEffect(() => {
    if (tableList) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: tableList?.count, // 确保 data.count 是正确的总数值
        },
      }));
    }
  }, [tableList]);
  const handleTableChange: TableProps['onChange'] = (pagination) => {
    console.log(pagination);
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    setArticelQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setArticelQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 10 }));
      setTableParams({ pagination });
    }
  };
  const onEditTag = (record: PlanetKnowledge) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      show: true,
      tableValue: record,
      theasaurusList,
    }));
  };
  const [delTagModelProps, setDelTagModelProps] = useState<DelTagModelProps>({
    title: '删除标签',
    show: false,
    formValue: {},
    onOk: () => {
      setDelTagModelProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setDelTagModelProps((prev) => ({ ...prev, show: false }));
    },
  });
  const onDelTag = (record: PlanetKnowledge) => {
    setDelTagModelProps((prev) => ({
      ...prev,
      show: true,
      formValue: record,
    }));
  };
  const columns: ColumnsType<PlanetKnowledge> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    {
      title: '群组名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      align: 'center',
      render: (type: string) => {
        if (type === 'pay') {
          return <Tag color="orange">付费</Tag>;
        }
        return <Tag color="green">免费</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button className="mr-2" type="primary" onClick={() => onDelTag(record)}>
            删除标签
          </Button>
          <Button type="default" onClick={() => onEditTag(record)}>
            新增标签
          </Button>
        </div>
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
    title: '标签管理',
    show: false,
    newId: '',
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
  });
  const [theasaurusTagId, setTheasaurusTagId] = useState('');
  // const [CategoryIds, setCategoryIds] = useState({
  //   categoryIdOne: '',
  //   categoryIdTwo: '',
  //   categoryIdThree: '',
  // });
  // const [levelOneList, setLevelOneList] = useState([]);
  // const [levelTwoList, setLevelTwoList] = useState([]);
  // const [levelThreeList, setLevelThreeList] = useState([]);
  const [categoryQuery, setCategoryQuery] = useState<GetChildCategoryListReq>({
    area_id: '',
    level: -1,
    p_c_id: '',
  });
  const { data: theasaurusList } = useQuery({
    queryKey: ['theasaurusList'],
    queryFn: () => planetService.GetAreaList(),
  });
  // 查询标签
  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = await planetService.GetChildCateGory(categoryQuery);
      if (categoryQuery.level === 0) {
        setLevelOneList(data);
      } else if (categoryQuery.level === 1) {
        setLevelTwoList(data);
      } else if (categoryQuery.level === 2) {
        setLevelThreeList(data);
      }
    };

    fetchCategoryData();
  }, [categoryQuery]);
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card title="领航专栏">
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
        <EditorOrAddModel {...editorOrAddModelProps} />
        <DelTagModel {...delTagModelProps} />
      </Space>
    </>
  );
}
