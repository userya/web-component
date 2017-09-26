import { Component, Input } from '@angular/core';
import { CObject } from './c-object';
import { Meta } from './meta';
let meta = new Meta();
@Component({
    selector: 'k-dynamic',
    template: meta.getDynamicComponentTemplate()
})
export class DynamicComponent {

    @Input()
    config: CObject;

}