import { Component, Input } from '@angular/core';
import { CObject } from './c-object';

@Component({
    selector: 'k-div',
    template: `

        <div [ngClass]="{'col-default-height': defaultHeight}">
            <k-dynamic *ngFor="let conf of config.items" [config]="conf"></k-dynamic>
        </div>

       
    `,
    styles:[
        `
        .col-default-height {
            min-height: 100px
        }
        
        `
    ]
})
export class DivComponent {
    @Input()
    config: CObject;

    get defaultHeight(): boolean {
        return !this.config.hasItems();
    }

}