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
    limit: 20,
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
      pageSize: 20,
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
    const pageSize = pagination.pageSize ?? 20;
    setArticelQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setArticelQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
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
  // const onChangeTheasaurusTag = (e: any) => {
  //   setTheasaurusTagId(e.target.value);
  //   setCategoryQuery({ p_c_id: '-1', area_id: e.target.value, level: 0 });
  // };
  // const onChangeCategoryOneTag = (e: any) => {
  //   setCategoryIds((prev) => ({ ...prev, categoryIdOne: e.target.value }));
  //   setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 1 }));
  // };
  // const onChangeCategoryTwoTag = (e: any) => {
  //   setCategoryIds((prev) => ({ ...prev, categoryIdTwo: e.target.value }));
  //   setCategoryQuery((prev) => ({ ...prev, p_c_id: e.target.value, level: 2 }));
  // };
  // const onChangeCategoryThreeTag: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
  //   const data = checkedValues.reduce((pre, cur) => {
  //     return `${pre} ${cur}`;
  //   }, '');
  //   setArticelQuery((prev) => ({
  //     ...prev,
  //     limit: 20,
  //     page: 1,
  //     content: data as string,
  //   }));
  // };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        {/* <Card>
          <div className="mb-4 flex flex-wrap items-center">
            <p className="mr-3 whitespace-nowrap text-base font-bold">词库板块</p>
            <Radio.Group onChange={onChangeTheasaurusTag} value={theasaurusTagId}>
              {theasaurusList?.data.map((item: NewsCategory, index: number) => (
                <Radio key={index} value={item.id}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          {levelOneList?.length > 0 && levelOneList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">一级标签</p>
              <Radio.Group onChange={onChangeCategoryOneTag} value={CategoryIds.categoryIdOne}>
                {levelOneList?.map((item: NewsCategory, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelTwoList?.length > 0 && levelTwoList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">二级标签</p>
              <Radio.Group onChange={onChangeCategoryTwoTag} value={CategoryIds.categoryIdTwo}>
                {levelTwoList?.map((item: NewsCategory, index: number) => (
                  <Radio key={index} value={item.c_id}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
          {levelThreeList?.length > 0 && levelThreeList && (
            <div className="mb-4 flex flex-wrap items-center">
              <p className="mr-3 whitespace-nowrap text-base font-bold">三级标签</p>
              <Checkbox.Group
                options={levelThreeList.map((item: NewsCategory) => ({
                  label: item.title,
                  value: item.title,
                }))}
                onChange={onChangeCategoryThreeTag}
              />
            </div>
          )}
        </Card> */}
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
