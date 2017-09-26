


let componentConfig = {
    layout: {
        xtype: 'layout',
        accept: '*'
    },
    div: {
        xtype: 'div',
        accept: '*'
    },
    row: {
        xtype: 'row',
    },
    col: {
        xtype: 'col',
        accept: '*'
    },
    text: {
        xtype: 'text'
    }
}


export class Meta {




    getComponentConfig(): any {
        return componentConfig;
    }

    getDynamicComponentTemplate(): string {

        let tpl = `
        <k-layout *ngIf="config.type == 'layout'" [config]="config" component-host></k-layout>
        <k-div *ngIf="config.type == 'div'" [config]="config" component-host></k-div>
        `
        let result = '';
        for (let type in componentConfig) {
            let xtype = componentConfig[type].xtype;
            result = result
                + '<k-' + xtype + ' *ngIf="config.type == \'' + xtype + '\'" [config]="config" component-host></k-' + xtype + '>\n';
        }
        console.log(result);
        return result;
    }

}


