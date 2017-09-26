import { Type } from '@angular/core';
import { DivComponent } from './div.component';

export class TypeUtils {

    getType(xtype: string): Type<any> {
        if (xtype == 'div') {
            return DivComponent;
        }
        return null ;
    }

}