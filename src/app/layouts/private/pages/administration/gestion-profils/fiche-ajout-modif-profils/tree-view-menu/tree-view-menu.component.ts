import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppTranslateService, ToastService } from '../../../../../../../app-shared/services';
import { SharedService } from '../../../../../../../app-shared/services/sharedWs/shared.service';
import { isInputChanged } from '../../../../../../../app-shared/tools/utils/ng-changes';
import { getNmCurrentLabel } from '../../../../../../../app-shared/tools';

class MenuNode {
  menuId!: string;
  id!: string;
  tooltip!: string;
  title!: string;
  isChecked!: boolean;
  isWrite!: boolean;
  desFr!: string;
  libelleFr!: string;
  libelleEn!: string;
  libelleAr!: string;
  submenus!: MenuNode[];
  idParent!: string;
  idFonc!: string;
  isOnlyWrite!: boolean;
}

/** Flat to-do item node with expandable and level information */
class MenuFlatNode {
  id!: string;
  tooltip!: string;
  desFr!: string;

  title!: string;
  isChecked!: boolean;
  isWrite!: boolean;
  level!: number;
  expandable!: boolean;
  children!: MenuNode[];
  idParent!: string;
  idFonc!: string;
  idProfil!: string;

  indeterminate!: boolean;
  isOnlyWrite!: boolean;
}

@Component({
  selector: 'app-tree-view-menu',
  standalone: false,
  templateUrl: './tree-view-menu.component.html',
  styleUrls: ['./tree-view-menu.component.css'],
})
export class TreeViewMenuComponent implements OnInit {
  private mySubscription: Subscription;
  @Input() editMode: any;
  @Input() data: any;
  @Input() isDisable: boolean = false;
  @Output() dataChecked = new EventEmitter<any>();
  @Input() applicationId: any;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<MenuFlatNode, MenuNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<MenuNode, MenuFlatNode>();

  treeControl: FlatTreeControl<MenuFlatNode>;

  treeFlattener: MatTreeFlattener<MenuNode, MenuFlatNode>;

  dataSource: MatTreeFlatDataSource<MenuNode, MenuFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);

  dataChange = new BehaviorSubject<MenuNode[]>([]);
  displayedColumns = ['title', 'isRead', 'isWrite'];
  url!: string;

  constructor(
    private appTranslateService: AppTranslateService,
    private toast: ToastService,
    private sharedService: SharedService,
    private router: Router,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<MenuFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.mySubscription = this.dataChange.subscribe((data) => {
      this.dataSource.data = data;
      this.initAllNodesSelection(this.treeControl);
    });
  }

  ngOnInit(): void {
    this.url = this.router.url;
    if (this.url.includes('userProfil/detail')) {
      this.isDisable = true;
    } else {
      this.isDisable = false;
    }
    if (!this.editMode) {
      // this.getMenu();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isInputChanged(changes, 'data')) {
      this.dataSource.data = changes['data'].currentValue;
    }
  }

  getLevel = (node: MenuFlatNode) => node.level;

  isExpandable = (node: MenuFlatNode) => node.expandable;

  getChildren = (node: MenuNode): MenuNode[] => node.submenus;

  hasChild = (_: number, _nodeData: MenuFlatNode) => _nodeData.expandable;

  transformer = (node: MenuNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.id === node.menuId ? existingNode : new MenuFlatNode();
    flatNode.id = node.menuId ?? node.id;
    flatNode.tooltip = node.tooltip;
    flatNode.title = node[getNmCurrentLabel(this.appTranslateService.getCurrentLanguage())];
    flatNode.isChecked = node.isChecked;
    flatNode.level = level;
    flatNode.expandable = !!node.submenus?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    flatNode.isWrite = node.isWrite;
    flatNode.children = node.submenus;
    flatNode.idFonc = node.id;
    flatNode.idProfil = node.idParent;

    flatNode.isOnlyWrite = node.isOnlyWrite;
    flatNode.desFr = node.desFr;

    // flatNode.indeterminate = this.editMode ? this.checkIndeterminate(node) : false
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */

  initAllNodesSelection(treeControl: any) {
    let initChecked = this.treeControl.dataNodes.filter((elt) => elt.isChecked == true);
    initChecked.forEach((node) => this.checklistSelection.select(node));
  }

  toogleElements(node: any, event: any) {
    if (event.checked == true) {
      node.isChecked = true;
      let parentNodes = this.treeControl.dataNodes.filter(
        (elt) => elt.id == node.idParent || elt.id == node.idAdmFonc,
      );

      for (let parent of parentNodes) {
        parent.isChecked = true;
        this.checklistSelection.select(parent);
        if (parent.idParent != undefined || parent.idFonc != undefined) {
          let parentPNodes = this.treeControl.dataNodes.filter(
            (elt) => elt.id == parent.idParent || elt.id == parent.idFonc,
          );
          for (let parent1 of parentPNodes) {
            parent1.isChecked = true;
            this.checklistSelection.select(parent1);
            if (parent1.idParent != undefined || parent.idFonc != undefined) {
              let parentPNodes = this.treeControl.dataNodes.filter(
                (elt) => elt.id == parent1.idParent || elt.id == parent1.idFonc,
              );
            }
          }
        }
      }

      let descandants = this.treeControl.getDescendants(node);
      for (let child of descandants) {
        child.isChecked = true;
        this.checklistSelection.select(child);
        // this.checklistSelection.toggle(child)
      }
    } else {
      node.isChecked = false;
      if (true == node.expandable) {
        let descandants = this.treeControl.getDescendants(node);
        for (let child of descandants) {
          child.isChecked = false;
          this.checklistSelection.deselect(child);
          // this.checklistSelection.toggle(child)
        }
      }
      this.checklistSelection.deselect(node);
    }
  }

  toogleOnWrite(node: any, event: any) {
    if (event.checked) {
      node.isWrite = true;
      node.isChecked = true;

      let parentNodes = this.treeControl.dataNodes.filter(
        (elt) => elt.id == node.idParent || elt.id == node.idFonc,
      );

      for (let parent of parentNodes) {
        parent.isWrite = true;
        parent.isChecked = true;
        this.checklistSelection.select(parent);
        if (parent.idParent != undefined || parent.idFonc != undefined) {
          let parentPNodes = this.treeControl.dataNodes.filter(
            (elt) => elt.id == parent.idParent || elt.id == parent.idFonc,
          );

          for (let parent1 of parentPNodes) {
            parent1.isWrite = true;
            parent1.isChecked = true;
            this.checklistSelection.select(parent1);
            if (parent1.idParent != undefined || parent.idFonc != undefined) {
              let parentPNodes = this.treeControl.dataNodes.filter(
                (elt) => elt.id == parent1.idParent || elt.id == parent1.idFonc,
              );
            }
          }
        }
      }

      let descandants = this.treeControl.getDescendants(node);
      for (let child of descandants) {
        child.isWrite = true;
        child.isChecked = true;

        this.checklistSelection.select(child);
        // this.checklistSelection.toggle(child)
      }
    } else {
      node.isWrite = false;
      if (true == node.expandable) {
        let descandants = this.treeControl.getDescendants(node);
        for (let child of descandants) {
          child.isWrite = false;
          this.checklistSelection.deselect(child);
          // this.checklistSelection.toggle(child)
        }
      }
      this.checklistSelection.deselect(node);
    }
  }

  checkIndeterminate(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);

    if (node.expandable) {
      const checkedDescendants = descendants.filter((item) => item.isChecked !== true);
      return checkedDescendants.length > 0 && checkedDescendants.length < descendants.length;
    }

    return false;
  }

  checkIndeterminateWrite(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);

    if (node.expandable) {
      const checkedDescendants = descendants.filter((item) => item.isWrite !== true);
      return checkedDescendants.length > 0 && checkedDescendants.length < descendants.length;
    }

    return false;
  }
}
