import { Component, Input } from '@angular/core';
import { CObject } from '../c-object';

@Component({
    selector: 'k-row',
    template: `

       
    <div nz-row>
        <k-dynamic *ngFor="let conf of config.items" [config]="conf"></k-dynamic>
    </div>    

       
    `
})
export class RowComponent {
    @Input()
    config: CObject;


    

}