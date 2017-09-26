import { CObject } from './c-object';

import { Meta } from './meta';

/**
 * 1. undo redo
 * 2. selected element
 * 3. toAddElement
 * 4. targetElement  hover: accept: notaccept
 */
export class IdeHelp {

    private meta: Meta = new Meta();

    private config: CObject;

    parentDomain: string;

    /**
     * 待添加config
     */
    preAdd: CObject;



    /**
     * 选中
     */
    selected: any = {
        config: {},
        location: {}
    };

    /**
     * 右键对象
     */
    contextMenuTarget: {} = {
        target: null,
        location: {
            top: 0,
            left: 0
        }
    };

    /**
     * 移动，有2个状态 accept, notaccept
     * direction: 方位 上下 | 左右
     * {
     *  left:true ,
     *  top:false
     *  
     * }
     */
    dropTargetElement: {} = {
        parent: null,
        target: null,
        direction: null,
    };

    /**
     * hover Element
     */
    hoverElement: CObject = null;




    /**
     * 获取当前访问路径
     */
    getSelectedNavigation(): CObject[] {
        let current: CObject = this.selected.config;
        let array = [];
        if (current) {
            for (var i = 0; current != null; i++) {
                array.push(current.clone());
                current = current.getParent();
            }
        }
        return array;
    }

    setPreAdd(config: any): void {
        let obj: CObject = new CObject(config);
        this.preAdd = obj;
        this.notifyMessage('setPreAdd', { config: obj.getJSONConfig() })
    }


    setPreAddWithId(id: string): void {
        let find: CObject = this.config.findChildById(id);
        if (find) {
            // if (find.getType() == 'col') {
            //特殊处理
            // find = find.getParent();
            // }
            this.preAdd = find;
            this.notifyMessage('setPreAddWithId', { id: id });
        }
    }



    clearPreAddWithId(id: string): void {
        if (this.preAdd && this.preAdd.getId() == id) {
            this.clearPreAdd();
        }
    }
    clearPreAdd(): void {
        this.preAdd = null;
        this.notifyMessage('clearPreAdd', {});
    }
    clearDropTarget(): void {
        this.dropTargetElement = {
            parent: null,
            target: null
        };
    }


    /**
     * 移动到该元素上
     */
    setTargetElementWidthId(id: string, direction: {}): void {
        let find: CObject = this.config.findChildById(id);
        // console.log(direction);
        if (!find) {
            return;
        }
        if (!this.preAdd || !this.preAdd.getId()) {
            this.dropTargetElement = {
                parent: null,
                target: null,
                direction: {},
            };
            this.hoverElement = find;
            return;
        }
        this.hoverElement = null;
        this.dropTargetElement = {
            parent: find.getParent(),
            target: find,
            direction: direction
        }
        this.notifyMessage('setTargetElementWidthId', { id: id, direction: direction });
        this.notifyMessage('setIsAccept', { targetId: id, accept: this.isAccept() });
    }

    clearRightClick(): void {
        this.contextMenuTarget = {
            target: null,
            location: {
                top: 0,
                left: 0
            }
        };
        this.notifyMessage('clearContextMenu', {});
    }
    setRightClick(id: string, location: {}): void {
        let config: CObject = this.config.findChildById(id);
        if (!config) {
            return;
        }
        // this.select(id);
        this.contextMenuTarget = {
            target: config,
            location: location
        }
        // console.log(this.selected);
        this.notifyMessage('setContextMenu', {
            id: config.getId(),
            location: location
        });
    }

    setTargetElementWidthIdAndCalculateResult(id: string, direction: {}, rightClick: boolean, rightClickLocation: {}): void {
        this.setTargetElementWidthId(id, direction);
        if (!this.preAdd && !this.preAdd.getId()) {
            return;
        }
        let target: CObject = this.dropTargetElement['target'];

        let preAddObject: CObject = this.preAdd;

        if (this.preAdd.getId() == target.getId()) {
            //selected
            this.select(this.preAdd.getId());
            if (rightClick) {
                this.setRightClick(target.getId(), rightClickLocation);
            } else {
                this.clearRightClick();
            }
            this.clearPreAdd();
            this.clearDropTarget();

            // this.clearRightClick();
            // console.log('select=' ,this.preAdd);    
            return;
        }

        if (preAddObject.getType() == 'col') {
            preAddObject = preAddObject.getParent();
        }
        if (preAddObject.findChildById(target.getId())) {
            console.log('parent can\'t add to children.');
            this.clearSelected();
            this.clearPreAdd();
            this.clearDropTarget();
            this.clearRightClick();
            return;
        }

        if (this.isAccept()) {
            let result = this.getDropContainerAndIndex();
            if (result['container']) {
                let pre = this.config.findChildById(preAddObject.getId());
                let containerId = result['container'].getId();
                let index = result['index'];
                if (pre) {
                    //move// containerId: string, toAddId: string, index: number
                    this.move(containerId, preAddObject.getId(), index, false);
                } else {
                    //add
                    this.add(containerId, preAddObject.clone(), index, false, true);
                }
            }
        }

        this.clearSelected();
        this.clearDropTarget();
        this.clearPreAdd();
        this.clearRightClick();
    }

    isAccept(): boolean {
        let config = this.meta.getComponentConfig();
        let target: CObject = this.dropTargetElement['target'];
        let parent: CObject = this.dropTargetElement['parent'];
        if (!target || !this.preAdd) {
            return false;
        }
        if (this.preAdd.getId() == target.getId()) {
            return false;
        }
        if (this.preAdd.findChildById(target.getId())) {
            return false;
        }
        let targetConf = config[target.getType()];
        let parentConf = parent == null ? {} : config[parent.getType()];
        if (targetConf.accept && targetConf.accept == '*') {
            return true;
        } else {
            if (parentConf.accept && parentConf.accept == '*') {
                return true;
            }
        }
        return false;
    }

    getDropContainerAndIndex(): {} {
        let config = this.meta.getComponentConfig();
        let target: CObject = this.dropTargetElement['target'];
        let parent: CObject = this.dropTargetElement['parent'];
        let targetConf = config[target.getType()];
        let parentConf = parent == null ? {} : config[parent.getType()];
        let container: CObject = null;
        let index: number = 0;
        if (targetConf.accept && targetConf.accept == '*') {
            container = target;
            let i = 0;
            if (target.getConfig()['horizontal']) {
                // console.log('horizontal=>');
                if (this.dropTargetElement['direction'].isLeft) {
                    index = i == 0 ? 0 : i - 1;
                } else {
                    index = target.getItemsCount() + 1;
                }
            } else {
                if (this.dropTargetElement['direction'].isTop) {
                    index = i == 0 ? 0 : i - 1;
                } else {
                    index = target.getItemsCount() + 1;
                }
            }
        } else {
            if (parentConf.accept && parentConf.accept == '*') {
                container = parent;
                let i = parent.getIndex(target.getId());
                if (parent.getConfig()['horizontal']) {
                    // console.log('horizontal=>');
                    if (this.dropTargetElement['direction'].isLeft) {
                        index = i == 0 ? 0 : i - 1;
                    } else {
                        index = i + 1;
                    }
                } else {
                    if (this.dropTargetElement['direction'].isTop) {
                        index = i == 0 ? 0 : i - 1;
                    } else {
                        index = i + 1;
                    }
                }
                // console.log(index);
            }
        }
        return {
            container: container,
            index: index
        };
    }



    setConfig(config: CObject): void {
        this.config = config;
    }

    updateConfig(id: string, config: {}, undoRedo: boolean): void {
        let find: CObject = this.config.findChildById(id);
        if (find) {
            find.updateConfig(config);
        }

        this.notifyMessage('updateConfig', {
            id: id,
            config: config,
            undoRedo: undoRedo
        });

    }



    constructor() {
    }

    notifyMessage(cmdType: string, config: {}): void {
        if (!config) {
            config = {};
        }
        config['type'] = cmdType;
        // debugger;
        parent.postMessage(config, this.parentDomain);
    }

    notifySelectedMessage(config: {}): void {
        this.notifyMessage('selectComponent', config);
    }

    select(id: string): void {
        let config: CObject = this.config.findChildById(id);
        this.selected = {
            config: config,
            location: config.getElementLocation()
        }
        // console.log('select==>',this.selected);
        this.notifySelectedMessage({ id: id });
    }


    clearSelected(): void {
        this.selected = {
            config: {},
            location: {}
        }
    }


    add(id: string, config: CObject, index: number, undoRedo: boolean, nofity: boolean): void {
        let parent: CObject = this.config.findChildById(id);
        if (parent) {
            parent.addComponent(index, config.clone());
            // console.log('add');
            if (nofity) {
                this.notifyMessage('addComponent', {
                    parentId: id,
                    config: config.getJSONConfig(),
                    index: index,
                    undoRedo: undoRedo
                })
            }

        }
    }


    remove(id: string, undoRedo: boolean, nofity: boolean): void {
        let find: CObject = this.config.findChildById(id);
        if (find && find.getParent()) {
            find.getParent().removeChildComponent(id);
            // console.log('remove');
            if (nofity) {
                this.notifyMessage('removeComponent', {
                    id: id,
                    undoRedo: undoRedo
                });
            }
        }
    }







    move(containerId: string, toAddId: string, index: number, undoRedo: boolean): void {
        let config: CObject = this.config.findChildById(toAddId);
        let container: CObject = this.config.findChildById(containerId);
        let pos = container.getIndex(toAddId);
        let indexCal = index;
        if (pos != null) {
            // console.log('zunei');
            if (pos < index) {
                indexCal = index - 1;
            }
        }
        // console.log(indexCal);
        let clone = config.clone();
        let id = config.getId();
        this.remove(id, undoRedo, false);
        this.add(containerId, clone, indexCal, undoRedo, false);

        this.notifyMessage('moveComponent', {
            containerId: containerId,
            toAddId: toAddId,
            index: index,
            undoRedo: undoRedo
        })

    }

}