import { Component, Input, ElementRef } from '@angular/core';
import { CObject } from './c-object';
import { IdeHelp } from './ide-help';

@Component({
    selector: 'k-ide-drag',
    template: `
        <div class="ide-drag" [ngClass]="{'ide-drag-accept': isAccept, 'ide-drag-not-accept': !isAccept}"
            *ngIf="hasDraged" 
            [style.width.px]="width" 
            [style.height.px]="height" 
            [style.top.px]="top"
            [style.left.px]="left"
        >
            <div class="breadcrumbs">
                <div class="inner">
                    <div class="crumbs clearfix" title="">
                        <div class="crumb current">
                            <div class="inner">
                                <span class="icon">
                                <i class="el-icon n-div"></i>
                                </span>
                                <span class="label" [style.backgroundColor]="labelBackgroudColor">{{message}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="tools allow-drag-cursor" *ngIf="hasDraged">
            <div 
            [style.width.px]="dragWidth" 
            [style.height.px]="dragHeight" 
            [style.top.px]="dragTop"
            [style.left.px]="dragLeft"

             class="insert-guide " [ngClass]="{vertical:vertical,error:!isAccept}">
                <div class="label">can not drag here.</div>
            </div>            
        </div>
    `,
    styles: [
        `.ide-drag {
            opacity: 0.99;
            position: absolute;
            pointer-events: none;
        }
        .ide-drag-accept {
            border: 2px solid #FF7000;
        }
        .ide-drag-not-accept {
            border: 2px solid red;
        }
        .ide-drag > .breadcrumbs {
            text-align: center;
            width: 100%;
            margin-top: -17px;
          }
          .ide-drag > .breadcrumbs > .inner {
            position: relative;
            left: auto;
            top: auto;
            padding: 0;
          }
          .ide-drag > .breadcrumbs > .inner > .crumbs {
            margin: 0;
          }
          .ide-drag > .breadcrumbs > .inner > .crumbs > .crumb > .inner {
            float: none;
            // font-weight: bold;
            background-color: transparent;
            color: white;
            text-transform: uppercase;
          }
          .ide-drag > .breadcrumbs > .inner > .crumbs > .crumb > .inner > .icon {
            display: none;
          }
          .ide-drag > .breadcrumbs > .inner > .crumbs > .crumb > .inner > .label {
            padding: 5px 9px 3px 7px;
            background: #FF7000;
            border-radius: 3px 3px 0 0;
          }
          
          .tools {
            position: absolute;
            z-index: 14;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: visible;
            line-height: 12px;
          }
          .insert-guide {
            position: absolute;
            display: block;
            z-index: 12;
            pointer-events: none !important;
            height: 2px;
            background-color: #2F9FFC;
            line-height: 0;
            font-size: 0;
            -webkit-transition: background-color 0.3s ease;
            transition: background-color 0.3s ease;
          }
          .insert-guide > .label {
            position: absolute;
            opacity: 0.0;
            color: white;
            font-size: 12px;
            line-height: 12px;
            bottom: 4px;
            left: 2px;
            padding: 2px 6px;
            max-width: 400px;
            display: inline-block;
            border-radius: 3px;
            -webkit-transition: opacity 0.25s ease;
            transition: opacity 0.25s ease;
          }
          .insert-guide:before,
          .insert-guide:after {
            position: absolute;
            content: '';
            left: 0;
            top: -2px;
            width: 0px;
            height: 0px;
            border-style: solid;
            border-width: 3px 0 3px 5px;
            border-color: transparent transparent transparent #2F9FFC;
            -webkit-transition: border-color 0.3s ease;
            transition: border-color 0.3s ease;
          }
          .insert-guide:after {
            left: auto;
            right: 0;
            border-width: 3px 5px 3px 0;
            border-color: transparent #2F9FFC transparent transparent;
          }
          .insert-guide.error {
            background-color: #ed0000;
          }
          .insert-guide.error > .label {
            background-color: rgba(237, 0, 0, 0.9);
            opacity: 1.0;
          }
          .insert-guide.error:before {
            border-left-color: #ed0000;
          }
          .insert-guide.error:after {
            border-right-color: #ed0000;
          }
          .insert-guide.faded {
            opacity: 0.35;
          }
          .insert-guide.vertical:before,
          .insert-guide.vertical:after {
            top: -3px;
            left: -2px;
            right: auto;
          }
          .insert-guide.vertical:before {
            border-width: 5px 3px 0 3px;
            border-color: #2F9FFC transparent transparent transparent;
          }
          .insert-guide.vertical:after {
            top: auto;
            bottom: -3px;
            border-width: 0 3px 5px 3px;
            border-color: transparent transparent #2F9FFC transparent;
          }
          .insert-guide.vertical.error > .label {
            left: 10px;
            right: auto;
            bottom: auto;
            top: 0px;
          }
          .insert-guide.vertical.error:before {
            border-color: #ed0000 transparent transparent transparent;
          }
          .insert-guide.vertical.error:after {
            border-color: transparent transparent #ed0000 transparent;
          }
          .insert-guide.flat:before,
          .insert-guide.flat:after {
            display: none;
          }
          .insert-guide.bright {
            border-bottom-color: #2F9FFC;
          }
        `
    ]

})
export class IdeDragComponent {


    @Input()
    ideHelper: IdeHelp;


    get hasDraged(): boolean {
        let dropTarget: CObject = this.ideHelper.dropTargetElement['target'];
        let draged = dropTarget != null;
        return draged;
    }

    get message() {
        if (this.isAccept) {
            return this.xtype;
        } else {
            return '';
        }
    }

    get vertical(): boolean {
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        // console.log(container.getConfig()['horizontal']);
        // return !container.getConfig()['horizontal'];
        return container.getConfig()['horizontal'];
    }

    get isAccept() {
        return this.ideHelper.isAccept();
    }

    get labelBackgroudColor() {
        return this.ideHelper.isAccept() ? '#FF7000' : 'red';
    }

    get borderColor() {
        return this.ideHelper.isAccept() ? '#FF7000' : 'red';
    }


    get xtype() {
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        return container.getType();
    }

    get dragWidth(): number {
        let target: CObject = this.ideHelper.dropTargetElement['target'];
        if (!target) {
            return 0;
        }
        if (this.vertical) {
            //垂直
            return 2;
        } else {
            // 水平
            return target.getElementLocation().width;
        }

    }

    get dragHeight(): number {
        let target: CObject = this.ideHelper.dropTargetElement['target'];
        if (!target) {
            return 0;
        }
        if (this.vertical) {
            //垂直
            return target.getElementLocation().height;
        } else {
            // 水平
            return 2;
        }

    }

    get dragTop(): number {

        let target: CObject = this.ideHelper.dropTargetElement['target'];
        if (!target) {
            return 0;
        }
        // console.log("dragTop=", target.getElementLocation());
        let direction = this.ideHelper.dropTargetElement['direction'];
        if (this.vertical) {
            //垂直
            return target.getElementLocation().top;
        } else {
            // 水平
            if (direction.isTop) {
                return target.getElementLocation().top;
            } else {
                return target.getElementLocation().top + target.getElementLocation().height;
            }
        }

    }

    get dragLeft(): number {
        let target: CObject = this.ideHelper.dropTargetElement['target'];
        if (!target) {
            return 0;
        }
        let direction = this.ideHelper.dropTargetElement['direction'];
        if (this.vertical) {
            //垂直
            if (direction.isLeft) {
                return target.getElementLocation().left;
            } else {
                return target.getElementLocation().left + target.getElementLocation().width;
            }
        } else {
            // 水平
            return target.getElementLocation().left;
        }
    }




    get width(): number {
        if (!this.isAccept) {
            return 0;
        }
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        return container.getElementLocation().width;
    }
    get height(): number {
        if (!this.isAccept) {
            return 0;
        }
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        return container.getElementLocation().height;
    }
    get left(): number {
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        return container.getElementLocation().left;
    }
    get top(): number {
        let container: CObject = this.ideHelper.getDropContainerAndIndex()['container'];
        return container.getElementLocation().top;
    }

    // get transformStyle(): string {
    //     let l = this.left || 0;
    //     let t = this.top || 0;
    //     return "translate(" + l + "px, " + t + "px);";
    // }

}