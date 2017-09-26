

import { Component, Input, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { CObject } from './c-object';


@Component({
    selector: 'k-layout',
    template: `
        <div *ngIf="config" style="height:90%">
        <k-dynamic *ngFor="let conf of config.items" [config]="conf"></k-dynamic>
        </div>
        
    `
})
export class LayoutComponent implements AfterViewInit {
    @Input()
    config: CObject;

    constructor() {

    }

    ngAfterViewInit() {
        
    }

    loadComponent() {
    
    }

}