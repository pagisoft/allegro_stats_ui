import {Component, OnInit, HostBinding} from '@angular/core';
import {CategoriesService} from "../../service/categories.service";
import {IActionMapping, TREE_ACTIONS, KEYS} from "angular-tree-component";

@Component({
  selector: 'app-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss']
})
export class CategoriesSelectorComponent implements OnInit {

  constructor(private categoriesService: CategoriesService) { }


  ngOnInit() {
    this.categoriesService.getCategories().subscribe(
      response => {
        this.nodes = <any>response;
      });
  }

  nodes: any[];

  // Mapping of keys and mouse events to actions
  actionMapping: IActionMapping = {
    mouse: {
      contextMenu: (tree, node, $event) => {
        $event.preventDefault();
      },
      dblClick: (tree, node, $event) => {
        if (node.hasChildren) {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
      click: this.selectItem
    }
  };

  // Tree parameters
  customTemplateStringOptions = {
    isExpandedField: 'expanded',
    idField: 'id',
    actionMapping: this.actionMapping,
    nodeHeight: 40,
    allowDrag: true,
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2

  };

  selectItem(tree, node, $event) {
    TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
  }



}
