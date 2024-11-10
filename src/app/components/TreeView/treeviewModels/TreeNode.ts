export interface TreeNode {
  parent?: TreeNode;
  label: string;
  level: number;
  children?: TreeNode[];
  pointId?: string;
  type: string;
  expandable: boolean;
  expanded?: boolean;
  isSelected: boolean;
  parentPointId?: string;
}
