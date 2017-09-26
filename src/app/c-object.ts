import { Type, ElementRef } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { DivComponent } from './div.component';
import { TypeUtils } from './type-utils';
import { IdeHelp } from './ide-help';

var typeUtils = new TypeUtils();

export class CObject {

    private id: string;
    private type: string;
    private config: any;
    private attribute: any;
    private items: any[];
    private component: Type<any>;
    private parent: CObject;

    private ideHelp: IdeHelp;

    private refElement: ElementRef;


    getJSONConfig(): {} {
        var its = [];
        if (this.items) {
            for (var i = 0; i < this.items.length; i++) {
                its.push(this.items[i].getJSONConfig())
            }
        }
        var result = {
            id: this.id,
            type: this.type,
            config: this.config,
            attribute: this.attribute,
            items: its
        };
        return result;
    }

    clone(): CObject {
        let items = [];
        if (this.items) {
            for (var i = 0; i < this.items.length; i++) {
                items.push(this.items[i].clone());
            }
        }
        let that = this;
        let result: CObject = new CObject({
            id: that.id,
            type: that.type,
            config: that.config,
            attribute: that.attribute,
            items: items
        });
        return result;
    }

    constructor(options: {
        id?: string,
        type?: string,
        config?: {},
        attribute?: {},
        items?: any[],
        ideHelp?: {},
    } = {}) {
        this.id = options.id ? options.id : uuid();
        this.type = options.type;
        this.config = options.config ? options.config : {};
        this.attribute = options.attribute ? options.attribute : {};
        this.items = [];
        if (options.items) {
            for (var i = 0; i < options.items.length; i++) {
                var item = options.items[i];
                let itemObject = new CObject(item);
                itemObject.setParent(this);
                this.items.push(itemObject);
            }
        }
        this.component = typeUtils.getType(this.type);
        this.ideHelp = options.ideHelp ? new IdeHelp() : null;
    }

    getComponent(): Type<any> {
        return this.component;
    }

    getParent(): CObject {
        return this.parent;
    }

    hasItems(): boolean {
        return this.items != null && this.items.length > 0;
    }

    getItemsCount():number {
        return this.items.length;
    }

    addComponent(index: number, child: CObject): void {
        child.parent = this;
        this.items.splice(index, 0, child);
    }

    addComponentByParentId(id: string, index: number, child: CObject): void {
        let item = this._findChildById(this, id);
        if (item == null) {
            return;
        }
        console.log(item);
        item.addComponent(index, child);
    }

    removeChildComponent(id: string): void {
        if (this.items) {
            var index = null;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getId() == id) {
                    index = i;
                }
            }
            if (index != null) {
                this.items.splice(index, 1);
            }
        }
    }

    getIndex(id: string): number {
        let result = null;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].getId() == id) {
                result = i;
                break;
            }
        }
        return result;
    }

    findChildById(id: string): CObject {
        return this._findChildById(this, id);
    }

    private _findChildById(parent: CObject, id: string): CObject {
        if (parent.id == id) {
            return parent;
        }
        if (parent.items) {
            for (var i = 0; i < parent.items.length; i++) {
                let item = parent.items[i];
                if (item.id == id) {
                    return item;
                }
                let found = this._findChildById(item, id);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    setParent(parent: CObject): void {
        this.parent = parent;
    }

    setElementRef(refElement: ElementRef): void {
        this.refElement = refElement;
    }

    getId(): string {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getRoot(): CObject {
        if (this.parent == null) {
            return this;
        }
        var current = this.parent;
        while (current.parent != null) {
            current = current.parent;
        }
        return current;
    }

    getIdeHelper(): IdeHelp {
        return this.ideHelp;
    }

    getElementLocation(): any {
        if (!this.refElement) {
            return {
                width: 0,
                height: 0,
                left: 0,
                top: 0
            }
        }
        let width = this.refElement.nativeElement.children[0].getBoundingClientRect().width;
        let height = this.refElement.nativeElement.children[0].getBoundingClientRect().height;
        let left = this.refElement.nativeElement.children[0].getBoundingClientRect().left + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        let top = this.refElement.nativeElement.children[0].getBoundingClientRect().top + document.documentElement.scrollTop - document.documentElement.clientTop;

        return {
            width: width,
            height: height,
            left: left,
            top: top
        }
    }

    updateConfig(config: {}): void {
        if (config) {
            for (let key in config) {
                if (key == 'id') {
                    this.id = config[key];
                } else {
                    this.config[key] = config[key];
                }
            }
        }
    }

    getConfig() :{} {
        return this.config ;
    }

}


