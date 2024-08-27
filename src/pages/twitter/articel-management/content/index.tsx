import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Tag, Tooltip, Button, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import twitterService, { GetArticleReq } from '@/api/services/twitterService';

// import DelTagModel, { DelTagModelProps } from './delTag';
// import EditorOrAddModel, { EditorOrAddModelProps } from './editOrAddModel';

import { Tweet } from '#/entity';
import type { GetProp, TableProps } from 'antd';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
  pagination?: TablePaginationConfig;
}
export default function KnowledgeGrounp() {
  const queryClient = useQueryClient(); // 全局声明
  const [messageApi, contextHolder] = message.useMessage();
  const [articelQuery, setArticelQuery] = useState<GetArticleReq>({
    limit: 10,
    page: 1,
  });
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['twitterArticleList', articelQuery],
    queryFn: () => twitterService.GetArticleList(articelQuery),
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
  // const onEditTag = (record: Tweet) => {
  //   setEditorOrAddModelProps((prev) => ({
  //     ...prev,
  //     show: true,
  //     tableValue: record,
  //     theasaurusList,
  //   }));
  // };
  const queryClient = useQueryClient();
  // 使用 useMutation 钩子处理删除操作
  const delArticlemutation = useMutation({
    mutationFn: twitterService.DelArticles,
    onSuccess: () => {
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['twitterArticleList', articelQuery]);
    },
    onError: (error) => {
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });
  const onDelTag = (record: Tweet) => {
    console.log(record);
    const delData = { tweet_ids: [record.id] };
    delArticlemutation.mutate(delData);
  };
  const columns: ColumnsType<Tweet> = [
    // { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    {
      title: '作者',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: 'profile_image_url0',
      dataIndex: 'profile_image_url0',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'hidden',
      key: 'hidden',
      width: 100,
      align: 'center',
      render: (type: boolean) => {
        if (type) {
          return <Tag color="red">屏蔽</Tag>;
        }
        return <Tag color="green">显示</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'text',
      key: 'text',
      width: 200,
      render: (_, record) => (
        <Tooltip title={record.text}>
          <div
            className="ellipsis"
            style={{
              float: 'left',
              maxWidth: '180px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {record.text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '语言',
      dataIndex: 'lang',
      key: 'lang',
      width: 50,
      align: 'center',
    },
    {
      title: '作者',
      dataIndex: 'like_count',
      key: 'like_count',
      width: 50,
      align: 'center',
    },
    {
      title: '回复',
      dataIndex: 'reply_count',
      key: 'reply_count',
      width: 50,
      align: 'center',
    },
    {
      title: '转推',
      dataIndex: 'retweet_count',
      key: 'retweet_count',
      width: 50,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
    },
    {
      title: '采集时间',
      dataIndex: 'created_time',
      key: 'created_time',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type="default" onClick={() => onEditTag(record)}>
            修改状态
          </Button>
          <Popconfirm
            title="Delete the Website"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => onDelTag(record)}
          >
            <Button className="mr-2" type="primary" onClick={() => onDelTag(record)}>
              删除
            </Button>
          </Popconfirm>
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

  // const [editorOrAddModelProps, setEditorOrAddModelProps] = useState<EditorOrAddModelProps>({
  //   title: '标签管理',
  //   show: false,
  //   newId: '',
  //   onOk: () => {
  //     setEditorOrAddModelProps((prev) => ({
  //       ...prev,
  //       show: false,
  //     }));
  //     // 重新获取数据或更新缓存
  //     queryClient.invalidateQueries(['mediaList']);
  //   },
  //   onCancel: () => {
  //     setEditorOrAddModelProps((prev) => ({
  //       ...prev,
  //       show: false,
  //     }));
  //   },
  // });
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
    queryFn: () => twitterService.GetAreaList(),
  });
  // 查询标签
  // useEffect(() => {
  //   const fetchCategoryData = async () => {
  //     const data = await twitterService.GetChildCateGory(categoryQuery);
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
        <Card title="推文内容">
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
        {/* <EditorOrAddModel {...editorOrAddModelProps} />
        <DelTagModel {...delTagModelProps} /> */}
      </Space>
    </>
  );
}
