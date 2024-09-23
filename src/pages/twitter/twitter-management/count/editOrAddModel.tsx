import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, Table, Form, Select, Button, Row, Col, Checkbox, message } from 'antd';
import { useEffect, useState } from 'react';

import twitterService, { SetCategroyTagsReq } from '@/api/services/twitterService';
import { ArrayToTree } from '@/utils/tree';

import { PlanetCategory, TweetCount, Theasaurus } from '#/entity';
import type { TableColumnsType, TableProps } from 'antd';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface TreeCategory extends PlanetCategory {
  children?: TreeCategory[];
}

export type EditorOrAddModelProps = {
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  tableValue: TweetCount;
  theasaurusList: Theasaurus[];
};

function EditorOrAddModel({
  title,
  show,
  onOk,
  onCancel,
  tableValue,
  theasaurusList,
}: EditorOrAddModelProps) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [queryNewsCategory, setQueryNewsCategory] = useState<{ area_id: string }>({ area_id: '' });

  const { data: tableList, isLoading: isLoadingCategoryList } = useQuery({
    queryKey: ['newsCategroyList', queryNewsCategory],
    queryFn: () => twitterService.GetCategoryList(queryNewsCategory),
  });

  const [treeCategory, setTreeCategory] = useState<TreeCategory[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList.data));
    }
  }, [tableList]);

  const columns: TableColumnsType<TreeCategory> = [
    { title: 'ID', dataIndex: 'c_id', key: 'c_id' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '名称(大写)', dataIndex: 'upper_title', key: 'upper_title' },
    { title: '所属板块', dataIndex: 'area_title', key: 'area_title' },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: TreeCategory[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const paths = selectedRows.map((item) => item.p_c_path);
    setSelectedPath(paths);
    console.log('Selected paths changed: ', paths);
  };

  const rowSelection: TableRowSelection<TreeCategory> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const setCategoryTags = useMutation({
    mutationFn: async (params: SetCategroyTagsReq) => {
      const res = await twitterService.SetCategroyTags(params);
      return res.data;
    },
    onSuccess: () => {
      message.success('添加成功');
      queryClient.invalidateQueries(['TwitterAcountList']);
      onOk();
    },
    onError: (error) => {
      console.error('Error adding:', error);
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const paramsValue = selectedPath.map((item, index) => ({
        area_id: values.area_id,
        c_id: selectedRowKeys[index],
        p_c_path: item,
      }));
      const params = {
        category_paths: paramsValue,
        author_id: tableValue.author_id,
      };
      setCategoryTags.mutate(params);
    } catch (error) {
      console.error('Validation failed:', error);
    }
    setSelectedPath([]);
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    const areaId = form.getFieldValue('area_id');
    setQueryNewsCategory({ area_id: areaId });
  }, [form]);
  const onValuesChange = () => {
    const areaId = form.getFieldValue('area_id');
    setQueryNewsCategory({ area_id: areaId });
  };

  const [isExpandAll, setIsExpandAll] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    // When isExpandAll changes, update expandedRowKeys
    if (isExpandAll) {
      const allKeys = treeCategory.map((item) => item.c_id);
      setExpandedRowKeys(allKeys);
    } else {
      setExpandedRowKeys([]);
    }
  }, [isExpandAll, treeCategory]);

  return (
    <Modal width={1000} title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="horizontal" onValuesChange={onValuesChange}>
        <Row gutter={[16, 16]}>
          <Col span={24} lg={10}>
            <Form.Item label="所属板块" name="area_id">
              <Select defaultValue={theasaurusList?.data[0]?.id}>
                {theasaurusList?.data.map((item: Theasaurus) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={24} lg={6}>
            <Button onClick={onSearchSubmit} type="primary">
              搜索
            </Button>
          </Col> */}
        </Row>
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Checkbox
            checked={isExpandAll}
            onChange={(e) => {
              setIsExpandAll(e.target.checked);
            }}
          >
            展开全部
          </Checkbox>
        </Col>
      </Row>

      <Table
        rowKey="c_id"
        size="small"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={treeCategory}
        loading={isLoadingCategoryList}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys((prev) => [...prev, record.c_id]);
            } else {
              setExpandedRowKeys((prev) => prev.filter((key) => key !== record.c_id));
            }
          },
        }}
      />
    </Modal>
  );
}

export default EditorOrAddModel;
