import { chain } from 'ramda';

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees);
}

// 数组转树
// export function TreeToArray<T extends { children?: T[] }>(arr: T[] = []): T[] {
//   return chain((node) => {
//     const children = node.children ? TreeToArray(node.children) : [];
//     return [...children, node];
//   }, arr);
// }

export type TreeOptionType = {
  a_id: string;
  c_id: string;
  created_at: string;
  del_tag: number;
  id: number;
  level: number;
  opt_status: number;
  order_n: number;
  p_c_path: string;
  p_c_id: string;
  updated_at: string;
  title: string;
  word_key: string;
  upper_title: string;
  children?: TreeOptionType[];
};

export function TreeToArray(items: TreeOptionType[]): TreeOptionType[] {
  const itemMap: { [key: string]: TreeOptionType } = {};

  // 将数组转换成以 c_id 为键的映射
  items.forEach((item) => {
    item.children = [];
    itemMap[item.c_id] = item;
  });

  const tree: TreeOptionType[] = [];

  // 构建树
  items.forEach((item) => {
    if (item.p_c_id && itemMap[item.p_c_id]) {
      itemMap[item.p_c_id].children?.push(item);
    } else {
      tree.push(item);
    }
  });

  return tree;
}
