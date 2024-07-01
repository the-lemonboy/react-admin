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
export function TreeToArray<T extends { children?: T[] }>(arr: T[] = []): T[] {
  return chain((node) => {
    const children = node.children ? TreeToArray(node.children) : [];
    return [...children, node];
  }, arr);
}
