import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import exchangeService, { GetDailyIncrease } from '@/api/services/exchangeService';
export default function DailyIncreasePage() {
  // const [formList,setFormList] = useState<any[]>([])
  const queryClient = useQueryClient();
  const { data: tableList, isLoading: isLoadingList } = useQuery({
    queryKey: ['articelList'],
    queryFn: () => exchangeService.GetDailyIncrease(),
  });
  const columns: ColumnsType<NewsSearchList> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'full_name', key: 'full_name' },
    {
      title: '内容',
      dataIndex: 'exchange_media_title',
      key: 'exchange_media_title',
    },
    { title: '时间', dataIndex: 'day_time', key: 'day_time', width: 200 },
  ];
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card title="文章列表">
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={tableList?.data}
          loading={isLoadingList}
          // pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Card>
    </Space>
  );
}
