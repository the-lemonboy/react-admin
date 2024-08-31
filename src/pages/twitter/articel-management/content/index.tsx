import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Tooltip, Button, Popconfirm, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import twitterService, { GetArticleReq, SetArticlesStatusReq } from '@/api/services/twitterService';

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
  // 使用 useMutation 钩子处理删除操作
  const delArticlemutation = useMutation({
    mutationFn: twitterService.DelArticles,
    onSuccess: () => {
      messageApi.success('删除成功');
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['twitterArticleList', articelQuery]);
    },
    onError: (error) => {
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });
  const onDelTag = (record: Tweet) => {
    const delData = { tweet_ids: [record.tweet_id] };
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
      title: '头像',
      dataIndex: 'profile_image_url0',
      key: 'profile_image_url0',
      align: 'center',
      width: 80,
      render: (text: string) => (
        <img src={text} alt="icon" style={{ width: 30, height: 30, margin: 'auto' }} />
      ),
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
      title: '状态',
      dataIndex: 'hidden',
      key: 'hidden',
      width: 100,
      align: 'center',
      render: (_: any, record: any) => (
        <Switch
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          defaultChecked={record.hidden}
          checked={!record.hidden}
          onClick={(checked, e) => onChanheHideStatus(checked, record, e)}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'opt_status',
      key: 'opt_status',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Popconfirm
            title="是否删除该条数据"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => onDelTag(record)}
          >
            <Button className="mr-2" type="primary">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const changeDistributedMutation = useMutation({
    mutationFn: async (params: SetArticlesStatusReq) => {
      const res = await twitterService.SetArticlesStatus(params);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success('状态修改成功');
      // 成功删除后，重新获取数据或更新缓存
      queryClient.invalidateQueries(['twitterArticleList', articelQuery]);
    },
    onError: (error) => {
      messageApi.error('状态修改失败');
      // 处理错误
      console.error('Error deleting website:', error);
    },
  });
  const onChanheHideStatus = (checked: boolean, record: Tweet, e: any) => {
    // 修改分发状态逻辑
    changeDistributedMutation.mutate({
      tweet_ids: [record.tweet_id],
      hidden: !checked,
    });
  };
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
  //   queryFn: () => twitterService.GetAreaList(),
  // });
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
  const [selectItems, setSelectItems] = useState<string[]>([]);

  const onChangeTableList = (selectedRowKeys: any, selectedRows: Tweet[]) => {
    const tweetIds = selectedRows.map((item) => item.tweet_id);
    setSelectItems(tweetIds);
  };
  const onChangeSelectHiddenStatus = () => {
    if (selectItems.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请选择要操作的数据',
      });
    } else {
      changeDistributedMutation.mutate({ tweet_ids: selectItems, hidden: true });
    }
  };
  const onChangeSelectShowStatus = () => {
    if (selectItems.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请选择要操作的数据',
      });
    } else {
      changeDistributedMutation.mutate({ tweet_ids: selectItems, hidden: false });
    }
  };
  const onDelSelectItems = () => {
    if (selectItems.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请选择要操作的数据',
      });
    } else {
      delArticlemutation.mutate({ tweet_ids: selectItems });
    }
  };
  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" className="w-full">
        <Card
          title="推文内容"
          extra={
            <div>
              <Button
                className="mr-5"
                style={{ background: '#1DA57A', color: '#fff' }}
                onClick={onChangeSelectShowStatus}
              >
                显示
              </Button>
              <Button
                className="bg-red mr-5"
                style={{ background: '#de3f00', color: '#fff' }}
                onClick={onChangeSelectHiddenStatus}
              >
                隐藏
              </Button>
              <Button type="primary" onClick={onDelSelectItems}>
                删除记录
              </Button>
            </div>
          }
        >
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            rowSelection={{ type: 'checkbox', onChange: onChangeTableList }}
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
