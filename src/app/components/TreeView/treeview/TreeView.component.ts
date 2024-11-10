import { Component, OnInit } from '@angular/core';
// import { TreeNode } from 'primeng/api';  // Ensure this import is correct
import { NodeService } from '../treeviewService/Node.service'; // Adjust path if needed
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree'; // Import TreeModule
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TreeNode } from '../treeviewModels/TreeNode';
//import { TreeNode } from 'primeng/api';
@Component({
  selector: 'app-TreeView',
  templateUrl: './TreeView.component.html',
  styleUrls: ['./TreeView.component.css'],
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TreeModule,
    ButtonModule,
  ], // Ensure correct modules are imported
  providers: [NodeService],
})
export class TreeViewComponent implements OnInit {
  files!: TreeNode[]; // TreeNode array for the file data
  searchQuery: string = ''; // Bind search query here
  treeData: TreeNode[] = [];
  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    // Fetch the tree data from NodeService
    // this.nodeService.getFiles().then((data: TreeNode[]) => {
    //   this.files = data;
    // });
    this.nodeService.generateTreeViewData().subscribe((data: TreeNode[]) => {
      this.treeData = data;
      console.log('this.treeData', this.treeData);
    });
  }

  expandAll() {
    this.treeData.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.treeData.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
