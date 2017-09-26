import { Component, Input, ElementRef } from '@angular/core';
import { CObject } from './c-object';
import { IdeHelp } from './ide-help';

@Component({
    selector: 'k-ide-selected',
    template: `
        <div class="ide-selected" 
            *ngIf="hasSelected" 
            [style.width.px]="width" 
            [style.height.px]="height" 
            [style.top.px]="top"
            [style.left.px]="left"
        >
            <div class="breadcrumbs" [style.marginTop.px]="marginTopPx">
                <div class="crumb" *ngFor="let c of selectToolbar;let i = index">
                    <div class="inner">
                        <span class="label" (mouseup)="showOperationMenu(c)" >
                        {{c.type}}
                        </span>    
                        <span class="label"> 
                            <i *ngIf="i == 0" class="anticon anticon-setting" (click)="settingClick(c)"></i>&nbsp;
                        </span>
                    </div>
                    
                </div>
            </div>
        </div>    
    `,
    styles: [
        `.ide-selected {
            border:1px solid #178df7;
            position: absolute;
            pointer-events: none;
        }
        .ide-selected > .breadcrumbs {
            // margin-left: -3px;
            position: absolute;
            width: 100%;
            height: 25px;
            // margin-top: -58px;
        }
        .ide-selected > .breadcrumbs > .crumb{
            // position: absolute;
        }
        .ide-selected .inner {
            float: left;
            clear: both;
        }
        .ide-selected .inner >span {
            cursor: pointer;
            pointer-events:auto;
            background-color:#178df7;
            color:#fff;
        }
        .ide-selected .label {
            padding: 1px 4px 2px 3px;
            vertical-align: 1px;
            font-weight: normal;
            color: #178df7;
            font-size: 11px;
        }
        
        `
    ]

})
export class IdeSelectedComponent {


    @Input()
    ideHelper: IdeHelp;

    constructor(private el:ElementRef) {

    }

    get selectToolbar() {
        let current: CObject = this.ideHelper.selected.config;
        let array = [];
        for (var i = 0; i < 3 && current != null; i++) {
            array.push(current.clone());
            current = current.getParent();
        }
        return array;
    }

    get marginTopPx() {

        return this.needReverse ? 0: -19 * this.selectToolbar.length;
    }

    get needReverse():boolean {
        let top = this.el.nativeElement.children[0].getBoundingClientRect().top;
        let height = this.el.nativeElement.querySelector('.breadcrumbs').getBoundingClientRect().height;
        return top < height ;
    }

    get hasSelected() {
        return this.ideHelper.selected.config.id;
    }

    get xtype() {
        return this.ideHelper.selected.config.type;
    }

    get width(): number {
        return this.ideHelper.selected.location.width;
    }
    get height(): number {
        return this.ideHelper.selected.location.height;
    }
    get left(): number {
        return this.ideHelper.selected.location.left;
    }
    get top(): number {
        return this.ideHelper.selected.location.top;
    }
    get transformStyle(): string {
        let l = this.left || 0;
        let t = this.top || 0;
        return "translate(" + l + "px, " + t + "px);";
    }

    showOperationMenu(c): void {
        // console.log('selected:', c);
        this.ideHelper.select(c.getId());
    }


    settingClick(c: CObject): void {
        alert('show extend setting');
    }

    /*
    hasSelected: boolean = true;
    width: number = 0;
    height: number = 0;
    left: number = 0;
    top: number = 0;
    **/

}