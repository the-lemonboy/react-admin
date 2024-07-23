import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

import newsService, { AddMediaReq } from '@/api/services/newsService';
import { ArrayToTree } from '@/utils/tree';

import { NewsCategory, PlanetKnowledge } from '#/entity';
import type { TableColumnsType } from 'antd';

interface TreeCategory extends NewsCategory {
  children?: TreeCategory[];
}
export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  newId: string;
  tableValue: PlanetKnowledge;
};

function EditorOrAddModel({ title, show, onOk, onCancel, newId, tableValue }: EditorOrAddModelProps) {
  const [queryNewsCategory, setQueryNewsCategory] = useState<{ area_id: string }>({ area_id: '' });
  const { data: tableList, isLoading: isLoadingCategoryList } = useQuery({
    queryKey: ['newsCategroyList', queryNewsCategory],
    queryFn: () => newsService.GetCategoryList(queryNewsCategory),
  });
  const [treeCategory, setTreeCategory] = useState<NewsCategory[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList.data) as TreeCategory[]);
    }
  }, [tableList]);
  const columns: TableColumnsType<NewsCategory> = [
    { title: 'ID', dataIndex: 'c_id', key: 'c_id' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '名称(大写)', dataIndex: 'upper_title', key: 'upper_title' },
    { title: '所属板块', dataIndex: 'area_title', key: 'area_title' },
  ];
  const { data: detailArticle } = useQuery({
    queryKey: ['detailArticle', newId],
    queryFn: () => {
      return newsService.GetArticelDetail(newId);
    },
    enabled: !!newId, // 当 newId 存在时启用查询
  });

  const { data: categoryList } = useQuery({
    queryKey: ['categoryList'],
    queryFn: () => newsService.GetCategoryList({ area_id: form }),
  });
  const queryClient = useQueryClient();
  const createMediaMutation = useMutation({
    mutationFn: async (params: AddMediaReq) => {
      const res = await newsService.AddMedia(params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberList']);
      onOk();
    },
    onError: (error) => {
      console.error('Error adding media:', error);
    },
  });

  const handleOk = async () => {
    try {
      // createMediaMutation.mutate(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleOptStatusChange = (e: any) => {
    form.setFieldsValue({ opt_status: e.target.value });
  };

  return (
    <Modal width={1000} title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Table
        rowKey="c_id"
        size="small"
        pagination={false}
        columns={columns}
        dataSource={treeCategory}
        loading={isLoadingCategoryList}
      />
    </Modal>
  );
}

export default EditorOrAddModel;
