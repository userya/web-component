import { Component, Input, ElementRef } from '@angular/core';
import { CObject } from './c-object';
import { IdeHelp } from './ide-help';

@Component({
    selector: 'k-ide-hover',
    template: `
        <div class="ide-hover" 
            *ngIf="hasHovered" 
            [style.width.px]="width" 
            [style.height.px]="height" 
            [style.top.px]="top"
            [style.left.px]="left"
            
        >
            <div class="breadcrumbs" [style.marginTop.px]="marginTopPx">
                <div class="inner">
                    <span class="label">{{xtype}}</span>    
                </div>
            </div>
        </div>    
    `,
    styles: [
        `.ide-hover {
            border:1px solid #178df7;
            position: absolute;
            pointer-events: none;
        }
        .ide-hover > .breadcrumbs {
            margin-left: -3px;
            position: absolute;
            width: 100%;
            height: 25px;
            // margin-top: -19px;
        }
        .ide-hover .inner {
            display: block;
        }
        .ide-hover .label {
            padding: 1px 4px 0 3px;
            vertical-align: 1px;
            font-weight: normal;
            color: #178df7;
            font-size: 11px;
        }
        `
    ]

})
export class IdeHoverComponent {


    @Input()
    ideHelper: IdeHelp;
    constructor(private el: ElementRef) {

    }

    get hasHovered(): boolean {
        let dropTarget: CObject = this.ideHelper.dropTargetElement['target'];
        let hovered: boolean = this.ideHelper.hoverElement != null &&
            (dropTarget == null || (dropTarget != null && this.ideHelper.hoverElement.getId() == dropTarget.getId()));
        // console.log(hovered);
        return hovered;
    }

    get marginTopPx() {
        return this.needReverse ? 0: -18;
    }

    get needReverse(): boolean {
        let top = this.el.nativeElement.children[0].getBoundingClientRect().top;
        let height = this.el.nativeElement.querySelector('.breadcrumbs').getBoundingClientRect().height;
        return top < height;
    }

    get xtype() {
        return this.ideHelper.hoverElement.getType();
    }

    get width(): number {
        return this.ideHelper.hoverElement.getElementLocation().width;
    }
    get height(): number {
        return this.ideHelper.hoverElement.getElementLocation().height;
    }
    get left(): number {
        return this.ideHelper.hoverElement.getElementLocation().left;
    }
    get top(): number {
        return this.ideHelper.hoverElement.getElementLocation().top;
    }
    get transformStyle(): string {
        let l = this.left || 0;
        let t = this.top || 0;
        return "translate(" + l + "px, " + t + "px);";
    }

}