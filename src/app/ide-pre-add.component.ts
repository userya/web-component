import { Component, Input, ElementRef } from '@angular/core';
import { CObject } from './c-object';
import { IdeHelp } from './ide-help';

@Component({
    selector: 'k-ide-pre-add',
    template: `
        <div class="ide-pre-add" 
            *ngIf="hasPreAdd" 
            [style.width.px]="width" 
            [style.height.px]="height" 
            [style.top.px]="top"
            [style.left.px]="left"
        >
         
        </div>    
    `,
    styles: [
        `.ide-pre-add {
            background-color:#ccc;
            opacity:0.5;
            position: absolute;
            pointer-events: none;
            z-index:999
        }
        `
    ]

})
export class IdePreAddComponent {


    @Input()
    ideHelper: IdeHelp;

    get selectToolbar() {
        let current: CObject = this.ideHelper.selected.config;
        let array = [];
        for (var i = 0; i < 3 && current != null; i++) {
            array.push(current.clone());
            current = current.getParent();
        }
        return array;
    }

    get hasPreAdd() {
        return this.ideHelper.preAdd != null;
    }



    get width(): number {
        return this.ideHelper.preAdd.getElementLocation().width;
    }
    get height(): number {
        return this.ideHelper.preAdd.getElementLocation().height;
    }
    get left(): number {
        return this.ideHelper.preAdd.getElementLocation().left;
    }
    get top(): number {
        return this.ideHelper.preAdd.getElementLocation().top;
    }
  

    /*
    hasSelected: boolean = true;
    width: number = 0;
    height: number = 0;
    left: number = 0;
    top: number = 0;
    **/

}