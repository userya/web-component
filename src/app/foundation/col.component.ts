import { Component, Input } from '@angular/core';
import { CObject } from '../c-object';

@Component({
    selector: 'k-col',
    template: `
        <div nz-col [nzSpan]="12" [ngClass]="{'col-default-height': defaultHeight}">
            <k-dynamic *ngFor="let conf of config.items" [config]="conf"></k-dynamic>
        </div>
    `,
    styles: [`

    .col-default-height {
        min-height: 100px
    }

    `]

})
export class ColComponent {
    @Input()
    config: CObject;

    ngOnInit() {
        // if (!this.config.getConfig()['horizontal']) {
        //     this.config.updateConfig({
        //         horizontal: true
        //     });
        // }
    }

    get defaultHeight(): boolean {
        
        return !this.config.hasItems();
    }


}