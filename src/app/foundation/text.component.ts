import { Component, Input } from '@angular/core';
import { CObject } from '../c-object';

@Component({
    selector: 'k-text',
    template: `

       
    <div style="min-height:50px;">
        text {{config.id}}
    </div>    

       
    `
})
export class TextComponent {
    @Input()
    config: CObject;


    

}