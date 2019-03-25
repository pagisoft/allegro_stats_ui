import {Component} from '@angular/core';
import {CategoriesService} from '../../service/categories.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Observable} from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss']
})
export class CategoriesSelectorComponent {

  flatNodeMap: Map<CategoryFlatNode, CategoryNode> = new Map<CategoryFlatNode, CategoryNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<CategoryNode, CategoryFlatNode> = new Map<CategoryNode, CategoryFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;

  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;

  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(true /* multiple */);

  constructor(private categoriesService: CategoriesService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.categoriesService.getCategories().subscribe(
      response => {
        this.dataSource.data = <any>response;
      });
  }

  getLevel = (node: CategoryFlatNode) => { return node.level; };

  isExpandable = (node: CategoryFlatNode) => { return node.expandable; };

  getChildren = (node: CategoryNode): Observable<CategoryNode[]> => {
    return of(node.children);
  }

  hasChild = (_: number, _nodeData: CategoryFlatNode) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => { return _nodeData.id === null; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.id === node.id
      ? this.nestedNodeMap.get(node)!
      : new CategoryFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: CategoryFlatNode) {
    const parentNode = this.flatNodeMap.get(node);;
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
  }

}

export class CategoryNode {
  children: CategoryNode[];
  id: String;
  name: String;
}

export class CategoryFlatNode {
  id: String;
  name: String;
  level: number;
  expandable: boolean;
}

