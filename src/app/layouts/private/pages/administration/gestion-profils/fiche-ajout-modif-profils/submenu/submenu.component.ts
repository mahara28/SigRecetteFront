import {
  ChangeDetectorRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { AppTranslateService, ToastService } from '../../../../../../../app-shared/services';
import { RequestObject } from '../../../../../../../app-shared/models';
import { PRIVATELAYOUTURI } from '../../../../../shared/constantes/common/private-layout.uri';
import { ConstanteWs } from '../../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../../app-shared/models/ResponseObject';
import { SharedService } from '../../../../../../../app-shared/services/sharedWs/shared.service';

type PermissionKey = 'add' | 'update' | 'delete' | 'details' | 'export' | 'import';

export class MenuNode {
  children!: MenuNode[];
  item!: string;
  label!: string;
  id!: string;
  checked!: boolean;
  permissions!: Record<PermissionKey, boolean>; // droits
}

export class MenuFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
  id!: string;
  checked!: boolean;
}

const TREE_DATA: any[] = [];

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<MenuNode[]>([]);

  get data(): MenuNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);

    this.dataChange.next(data);
  }

  buildFileTree(obj: any[], level: number): MenuNode[] {
    return obj.map((item) => {
      const node = new MenuNode();
      const label =
        AppTranslateService.getStoredLanguage() == 'fr'
          ? (node.item = item.codeTranslate)
          : (node.item = item.codeTranslate);

      node.label = label;
      //node.label = item.codeTranslate;
      node.id = item.id;
      node.checked = item.checked || false;
      node.permissions = {
        add: item.isAdd === 1,
        update: item.isUpdate === 1,
        delete: item.isSupp === 1,
        details: item.isDetails === 1,
        export: item.isExport === 1,
        import: item.isImprime === 1,
      };
      if (item.listSousMenu) {
        node.children = this.buildFileTree(item.listSousMenu, level + 1);
      }

      console.log('node : ', node);
      return node;
    });
  }

  updateItem(node: MenuNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-submenu',
  standalone: false,
  templateUrl: './submenu.component.html',
})
export class SubmenuComponent {
  @Output() dataChecked = new EventEmitter<any>();

  @Input() editMode: any;
  @Input() data: any;
  @Input() isDisable: boolean = false;
  checkedItemIds: string[] = [];
  private cdr = inject(ChangeDetectorRef);

  openNodeId: string | null = null;

  permissionList: { key: PermissionKey; label: string; icon: string }[] = [
    { key: 'add', label: 'menu.perm_add', icon: 'add_circle' },
    { key: 'update', label: 'menu.perm_update', icon: 'edit' },
    { key: 'delete', label: 'menu.perm_delete', icon: 'delete' },
    { key: 'details', label: 'menu.perm_details', icon: 'info' },
    { key: 'export', label: 'menu.perm_export', icon: 'file_download' },
    { key: 'import', label: 'menu.perm_import', icon: 'file_upload' },
  ];

  ngOnInit() {
    if (!this.editMode) {
      this.getMenu();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      const data = this.database.buildFileTree(this.data, 0);
      this.database.dataChange.next(data);
    }
  }
  emitData() {
    const result: any[] = [];

    this.treeControl.dataNodes.forEach((flatNode) => {
      const node = this.flatNodeMap.get(flatNode);

      if (node && node.checked) {
        result.push({
          idFonc: node.id,
          permissions: node.permissions,
        });
        console.log('resultat : ', result);
      }
    });

    this.dataChecked.emit(result);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.dropdown')) {
      this.openNodeId = null;
    }
  }

  isNodeEnabled(node: MenuNode): boolean {
    return !!node.checked;
  }
  toggleDropdown(node: MenuNode) {
    if (this.openNodeId === node.id) {
      this.openNodeId = null; // fermer si déjà ouvert
    } else {
      this.openNodeId = node.id; // ouvrir et fermer les autres
    }
  }

  handleCheckedNodes() {
    this.dataSource.data.forEach((node) => {
      if (!node.checked) {
        const flatNode = this.nestedNodeMap.get(node);
        if (flatNode) {
          this.checklistSelection.select(flatNode);
        }
      }
    });
  }

  getMenu() {
    const request: RequestObject = <RequestObject>{
      //  uri: FICHE_LISTE_PROFILS.MENU,
      uri: PRIVATELAYOUTURI.SIDEBAR.MENU,
      params: {
        query: {
          // idProfil: this.id
          idProfil: null,
        },
      },

      method: ConstanteWs._CODE_GET,
    };
    console.log('getMenue:', request);

    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
          const menuData = response.payload || [];
          const data = this.database.buildFileTree(menuData, 0);
          this.database.dataChange.next(data);
        } else {
          console.error(
            `Error in FicheAjoutModifProfilsComponent/getMenu, error code :: ${response.code}`,
          );
          this.toast.error();
        }
      },
      error: (error: any) => {
        console.error(`Error in FicheAjoutModifProfilsComponent/getMenu, error :: ${error}`);
        this.toast.error();
      },
    });
  }

  getParentNode(node: MenuFlatNode): MenuFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /* handleCheckboxChange(change: any): void {
    change.added.forEach((node: any) => {
      if (!this.checkedItemIds.includes(node.id)) {
        this.checkedItemIds.push(node.id);
      }

      // Include parent nodes up the tree
      let parent = this.getParentNode(node);
      while (parent) {
        if (!this.checkedItemIds.includes(parent.id)) {
          this.checkedItemIds.push(parent.id);
        }
        parent = this.getParentNode(parent);
      }
    });

    change.removed.forEach((node: any) => {
      this.checkedItemIds = this.checkedItemIds.filter((id) => id !== node.id);

      // Optional: Remove parent if no children are selected anymore (depends on your logic)
      let parent = this.getParentNode(node);
      while (parent) {
        const descendants = this.treeControl.getDescendants(parent);
        const anyChildSelected = descendants.some((descendant) =>
          this.checklistSelection.isSelected(descendant),
        );

        if (!anyChildSelected) {
          this.checkedItemIds = this.checkedItemIds.filter((id) => id !== parent!.id);
        }
        parent = this.getParentNode(parent);
      }
    });

    this.dataChecked.emit(this.checkedItemIds);
  } */

  handleCheckboxChange(): void {
    const result: any[] = [];

    this.treeControl.dataNodes.forEach((flatNode) => {
      if (this.checklistSelection.isSelected(flatNode)) {
        const node = this.flatNodeMap.get(flatNode);

        if (node) {
          result.push({
            idFonc: node.id,
            permissions: node.permissions,
          });
        }
      }
    });

    this.checkedItemIds = result.map((r) => r.idFonc);

    this.dataChecked.emit(result);

    console.log('FINAL RESULT:', result);
  }
  toggleMenu(node: MenuNode) {
    node.checked = !node.checked;

    // Si décoché → désactive toutes les permissions
    if (!node.checked && node.permissions) {
      Object.keys(node.permissions).forEach((key) => {
        node.permissions[key as PermissionKey] = false;
      });
    }

    // Force Angular à rafraîchir le template
    //this.cdr.markForCheck();
  }

  togglePermission(flatNode: MenuFlatNode, key: PermissionKey) {
    const node = this.flatNodeMap.get(flatNode);

    if (!node || !this.checklistSelection.isSelected(flatNode)) return;

    node.permissions[key] = !node.permissions[key];

    console.log('toggle:', node);
  }

  flatNodeMap = new Map<MenuFlatNode, MenuNode>();

  nestedNodeMap = new Map<MenuNode, MenuFlatNode>();

  selectedParent: MenuFlatNode | null = null;

  newItemName = '';

  treeControl: FlatTreeControl<MenuFlatNode>;

  treeFlattener: MatTreeFlattener<MenuNode, MenuFlatNode>;

  dataSource: MatTreeFlatDataSource<MenuNode, MenuFlatNode>;

  checklistSelection = new SelectionModel<MenuFlatNode>(true);

  constructor(
    private database: ChecklistDatabase,
    private sharedService: SharedService,

    private toast: ToastService,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<MenuFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe((data) => {
      this.dataSource.data = data;

      this.selectAllCheckboxes();
    });
    this.checklistSelection.changed.subscribe((change) => {
      this.handleCheckboxChange();
      //this.emitData();
    });
  }
  selectAllCheckboxes() {
    this.treeControl.dataNodes.forEach((node) => {
      if (node.checked) {
        this.checklistSelection.select(node);
      }
    });
  }
  // handleCheckboxChange(change: any): void {
  //   change.added.forEach((node) => {

  //     if (!this.checkedItemIds.includes(node.id)) {
  //       this.checkedItemIds.push(node.id);
  //     }

  //   });

  //   change.removed.forEach((node) => {

  //     this.checkedItemIds = this.checkedItemIds.filter(id => id !== node.id);
  //   });

  //   this.dataChecked.emit(this.checkedItemIds);

  // }

  getLevel = (node: MenuFlatNode) => node.level;

  isExpandable = (node: MenuFlatNode) => node.expandable;

  getChildren = (node: MenuNode): MenuNode[] => node.children;

  hasChild = (_: number, _nodeData: MenuFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: MenuFlatNode) => _nodeData.item === '';

  transformer = (node: MenuNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new MenuFlatNode();
    flatNode.item = node.item;
    flatNode.id = node.id;
    flatNode.checked = node.checked;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    if (!flatNode.expandable && node.checked) {
    }

    return flatNode;
  };

  descendantsAllSelected(node: MenuFlatNode): boolean {
    if (node.checked) {
    }
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: MenuFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);

    const result = descendants.some((child) => this.checklistSelection.isSelected(child));

    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: MenuFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  saveNode(node: MenuFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }
}
