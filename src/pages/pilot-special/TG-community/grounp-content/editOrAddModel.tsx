import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal, Table, Form, Select } from 'antd';
import { useEffect, useState } from 'react';

import TGService, { SetCategroyTagsReq } from '@/api/services/TGService';
import { ArrayToTree } from '@/utils/tree';

import { PlanetCategory, TG, Theasaurus } from '#/entity';
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
  tableValue: TG;
  theasaurusList: Theasaurus;
};

function EditorOrAddModel({
  title,
  show,
  onOk,
  onCancel,
  tableValue,
  theasaurusList,
}: EditorOrAddModelProps) {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<TG>();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  const [queryNewsCategory, setQueryNewsCategory] = useState<{ area_id: string }>({ area_id: '' });
  const { data: tableList, isLoading: isLoadingCategoryList } = useQuery({
    queryKey: ['newsCategroyList', queryNewsCategory],
    queryFn: () => TGService.GetCategoryList(queryNewsCategory),
  });
  const [treeCategory, setTreeCategory] = useState<TG[]>([]);
  useEffect(() => {
    if (tableList) {
      setTreeCategory(ArrayToTree(tableList.data) as TG[]);
    }
  }, [tableList]);
  const columns: TableColumnsType<TG> = [
    { title: 'ID', dataIndex: 'c_id', key: 'c_id' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '名称(大写)', dataIndex: 'upper_title', key: 'upper_title' },
    { title: '所属板块', dataIndex: 'area_title', key: 'area_title' },
  ];
  // const { data: categoryList } = useQuery({
  //   queryKey: ['categoryList'],
  //   queryFn: () => TGService.GetCategoryList({ area_id: form }),
  // });

  // 查找路径
  const findPath = (tree: TreeNode[], id: string): TreeNode[] => {
    const path: TreeNode[] = [];
    const findNodePath = (nodes: TreeNode[], targetId: string): boolean => {
      for (const node of nodes) {
        if (node.c_id === targetId) {
          path.unshift(node);
          return true;
        }
        if (node.children && findNodePath(node.children, targetId)) {
          path.unshift(node);
          return true;
        }
      }
      return false;
    };

    findNodePath(tree, id);
    return path;
  };
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const handleOptStatusChange = (e: any) => {
    form.setFieldsValue({ opt_status: e.target.value });
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedPaths: string[] = newSelectedRowKeys.map((item) => {
      const pathNodes = findPath(treeCategory, item.toString());
      const path = pathNodes.map((node) => node.c_id).join('/');
      return path;
    });
    setSelectedPath(newSelectedPaths);
    console.log('selectedRowKeys changed: ', newSelectedPaths);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<PlanetCategory> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const setCategoryTags = useMutation({
    mutationFn: async (params: SetCategroyTagsReq) => {
      const res = await TGService.SetCategroyTags(params);
      return res.data;
    },
    onSuccess: () => {
      onOk();
    },
    onError: (error) => {
      console.error('Error adding media:', error);
    },
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const paramsValue = selectedPath.map((item) => {
        return {
          area_id: values.area_id,
          c_id: tableValue.id,
          p_c_path: item,
        };
      });
      const params = {
        category_paths: paramsValue,
        group_id: tableValue.group.group_id,
        topic_id: tableValue.topic_id,
      };
      setCategoryTags.mutate(params);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  return (
    <Modal width={1000} title={title} open={show} onOk={handleOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
      >
        <Form.Item<PlanetCategory> label="所属板块" name="area_id">
          <Select>
            {theasaurusList?.data.map((item: Theasaurus, index) => (
              <Select.Option key={index} value={item.id}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Table
        rowKey="c_id"
        size="small"
        rowSelection={rowSelection}
        // pagination={false}
        columns={columns}
        dataSource={treeCategory}
        loading={isLoadingCategoryList}
      />
    </Modal>
  );
}

export default EditorOrAddModel;
