import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Button, Radio, Checkbox } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import newsService, { GetChildCategoryListReq, GetNewsListReq } from '@/api/services/newsService';

import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { NewsSearchList, NewsCategory } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function NewsList() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [articelQuery, setArticelQuery] = useState<GetNewsListReq>({
    limit: 10,
    page: 1,
    area_id: '',
    content: '',
    date_range: '',
    exchange_media: '',
    last_level_cats: '',
    level_cat: '',
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['articelList', articelQuery],
    queryFn: () => newsService.GetArticelList(articelQuery),
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
  const onEditTag = (record: NewsSearchList) => {
    setEditorOrAddModelProps((prev) => ({
      ...prev,
      show: true,
      newId: record.news_key,
    }));
  };
  const columns: ColumnsType<NewsSearchList> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'title', key: 'title', width: 300 },
    {
      title: '新闻平台',
      dataIndex: 'exchange_media_title',
      key: 'exchange_media_title',
      width: 150,
    },
    { title: '发布时间', dataIndex: 'pub_time', key: 'pub_time', width: 200 },
    { title: '接受时间', dataIndex: 'created_time', key: 'created_time', width: 200 },
    {
      title: '状态',
      dataIndex: 'opt_status',
      key: 'opt_status',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type="primary" onClick={() => onEditTag(record)}>
            详细
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
  // const [theasaurusTagId, setTheasaurusTagId] = useState('');
  // const [CategoryIds, setCategoryIds] = useState({
  //   categoryIdOne: '',
  //   categoryIdTwo: '',
  //   categoryIdThree: '',
  // });
  // const [levelOneList, setLevelOneList] = useState([]);
  // const [levelTwoList, setLevelTwoList] = useState([]);
  // const [levelThreeList, setLevelThreeList] = useState([]);
  // const [categoryQuery, setCategoryQuery] = useState<GetChildCategoryListReq>({
  //   area_id: '',
  //   level: -1,
  //   p_c_id: '',
  // });
  // const { data: theasaurusList } = useQuery({
  //   queryKey: ['theasaurusList'],
  //   queryFn: () => newsService.GetTheasaurusList(),
  // });
  // // 查询标签
  // useEffect(() => {
  //   const fetchCategoryData = async () => {
  //     const data = await newsService.GetChildCateGory(categoryQuery);
  //     if (categoryQuery.level === 0) {
  //       setLevelOneList(data);
  //     } else if (categoryQuery.level === 1) {
  //       setLevelTwoList(data);
  //     } else if (categoryQuery.level === 2) {
  //       setLevelThreeList(data);
  //     }
  //   };

  //   fetchCategoryData();
  // }, [categoryQuery]);
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
  //     limit: 10,
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
          {levelOneList.length > 0 && levelOneList && (
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
          {levelTwoList.length > 0 && levelTwoList && (
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
          {levelThreeList.length > 0 && levelThreeList && (
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
        <Card title="媒体管理">
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
      </Space>
    </>
  );
}
