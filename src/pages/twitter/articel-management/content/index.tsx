import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space, message, Tooltip, Button, Switch, Drawer } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
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
    limit: 20,
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
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 20;
    setArticelQuery((prev) => ({ ...prev, page: current, limit: pageSize }));
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setArticelQuery((prev) => ({ ...prev, page: 1, limit: pagination.pageSize ?? 20 }));
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
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'tweet_id',
      dataIndex: 'tweet_id',
      key: 'tweet_id',
      width: 100,
      align: 'center',
      render: (_, record) => (
        // 跳转https://x.com/elonmusk/status/1831364314466553995
        <a
          href={`https://x.com/${record.username}/status/${record.tweet_id}`}
          target="_blank"
          rel="noreferrer"
        >
          {record.tweet_id}
        </a>
      ),
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
      title: '推特账号名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '推特账号ID',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="text-blue underline decoration-solid" onClick={() => showDrawer(record)}>
          {record.username}
        </div>
      ),
    },

    {
      title: '推特账号类型',
      dataIndex: 'lang',
      key: 'lang',
      width: 100,
      align: 'center',
    },
    {
      title: '推文类型',
      dataIndex: 'ref_type',
      key: 'ref_type',
      width: 100,
      align: 'center',
      render: (text: string) => {
        // retweeted: '转发', quoted：'引用', replied_to: '回复'， '': '原创'
        return text === 'retweeted'
          ? '转发'
          : text === 'quoted'
          ? '引用'
          : text === 'replied_to'
          ? '回复'
          : '原创';
      },
    },
    {
      title: '推文内容',
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
      title: '推文链接',
      dataIndex: 'tweet_url',
      key: 'tweet_url',
      width: 100,
      align: 'center',
    },
    {
      title: '评论数',
      dataIndex: 'like_count',
      key: 'like_count',
      width: 100,
      align: 'center',
    },

    {
      title: '转发数',
      dataIndex: 'retweet_count',
      key: 'retweet_count',
      width: 100,
      align: 'center',
    },
    {
      title: '引用数',
      dataIndex: 'quote_count',
      key: 'quote_count',
      width: 100,
      align: 'center',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
      width: 100,
      align: 'center',
    },
    {
      title: '收藏数',
      dataIndex: 'quote_count',
      key: 'quote_count',
      width: 100,
      align: 'center',
    },
    {
      title: '推送时间',
      dataIndex: 'created_time',
      key: 'created_time',
      width: 150,
      align: 'center',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '发推时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },

    // {
    //   title: '状态',
    //   dataIndex: 'hidden',
    //   key: 'hidden',
    //   width: 100,
    //   align: 'center',
    //   fixed: 'right',
    //   render: (_: any, record: any) => (
    //     <Switch
    //       checkedChildren="显示"
    //       unCheckedChildren="隐藏"
    //       defaultChecked={record.hidden}
    //       checked={!record.hidden}
    //       onClick={(checked, e) => onChanheHideStatus(checked, record, e)}
    //     />
    //   ),
    // },
  ];
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [detailUserInfo, setDetailUserInfo] = useState<Tweet | undefined>(undefined);

  const showDrawer = (record: Tweet) => {
    setDetailUserInfo(record);
    setDrawerVisible(true);
  };
  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };
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
          title="推文搜索"
          // extra={
          //   <div>
          //     <Button
          //       className="mr-5"
          //       style={{ background: '#1DA57A', color: '#fff' }}
          //       onClick={onChangeSelectShowStatus}
          //     >
          //       显示
          //     </Button>
          //     <Button
          //       className="bg-red mr-5"
          //       style={{ background: '#de3f00', color: '#fff' }}
          //       onClick={onChangeSelectHiddenStatus}
          //     >
          //       隐藏
          //     </Button>
          //   </div>
          // }
        >
          <Table
            scroll={{ x: 'max-content' }}
            rowKey="id"
            size="small"
            columns={columns}
            // rowSelection={{ type: 'checkbox', onChange: onChangeTableList }}
            dataSource={tableList?.data}
            loading={isLoadingList}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Card>
        <Drawer title="用户详情" open={drawerVisible} onClose={onCloseDrawer}>
          {detailUserInfo && (
            <div className="w-full">
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover"
                  src={detailUserInfo.avatar}
                  alt="用户头像"
                />
              </div>
              <div className="mt-4">
                <p className="font-weight text-xl">{detailUserInfo.name}</p>
                <p className="text-gray-600">
                  {detailUserInfo.mobile_number ? detailUserInfo.mobile_number : '无手机号'}
                </p>
                <p>状态: {detailUserInfo.suspended ? '禁用' : '开放'}</p>
                <p>账户创建时间: {detailUserInfo.created_time}</p>
              </div>
            </div>
          )}
        </Drawer>
      </Space>
    </>
  );
}
