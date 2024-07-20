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
// export function ArrayToTree<T extends { children?: T[] }>(arr: T[] = []): T[] {
//   return chain((node) => {
//     const children = node.children ? ArrayToTree(node.children) : [];
//     return [...children, node];
//   }, arr);
// }

export type TreeNode<T> = T & {
  children?: TreeNode<T>[];
};
export function ArrayToTree<T extends { c_id: string; p_c_id: string }>(
  items: TreeNode<T>[],
): TreeNode<T>[] {
  const itemMap: { [key: string]: TreeNode<T> } = {};

  // 将数组转换成以 c_id 为键的映射
  items.forEach((item) => {
    item.children = [];
    itemMap[item.c_id] = item;
  });

  const tree: TreeNode<T>[] = [];

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
