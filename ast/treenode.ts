import { Expression } from "./expression";

export interface TreeNode {
  discriminator: "TREENODE";
  getLHS?:() => Expression;
  getRHS?:() => Expression;
  getValue?:() => Expression;
}
export namespace TreeNode {
  export function isTreeNode(object: any): object is TreeNode {
    return object.discriminator === "TREENODE";
  }
}
