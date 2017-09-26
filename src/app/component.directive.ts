import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { CObject } from './c-object';

@Directive({
    selector: '[component-host]',
})
export class ComponentDirective {

    @Input()
    config: CObject;

    moveEvent$: Subject<any> = new Subject<any>();

    constructor(private el: ElementRef) {
        // console.log('===');
        this.moveEvent$.debounceTime(80).subscribe(this._mousemove);
    }

    ngAfterViewInit(): void {
        // console.log("=>" ,this.config);
        this.config.setElementRef(this.el);
    }

    @HostListener('mouseover', ['$event'])
    onMouseOver(event: any): boolean {
        // this.config.getRoot().getIdeHelper().setTargetElementWidthId(this.config.getId());
        // console.log(this.config.getId());
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    @HostListener('mouseout', ['$event'])
    onMouseOut(event: any): boolean {
        //  this.config.getRoot().getIdeHelper().clearPreAddWithId(this.config.getId());
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent): boolean {

        var arg = { target: this.config, postion: this.getPostion(event) };
        this.moveEvent$.next(arg);
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    private getPostion(event: MouseEvent): {} {

        // console.log(event);
        let offsetX = event.pageX;
        let offsetY = event.pageY;
        let left = this.config.getElementLocation().left;
        let top = this.config.getElementLocation().top;
        let width = this.config.getElementLocation().width;
        let height = this.config.getElementLocation().height;
        let isLeft = false;
        if ((left + width / 2) >= offsetX) {
            isLeft = true;
        }
        let isTop = false;
        if ((top + height / 2) >= offsetY) {
            // console.log(this.config.getType() + ",left:" + left + ",top:" + top + 
            //     ",height:" + height + ",offsetY:" + offsetY + ",offsetX:" + offsetX);
            isTop = true;
        }

        return { isLeft: isLeft, isTop: isTop };

    }

    _mousemove(arg: any) {
        //console.log("mousemove-" + config.getId());
        let config: CObject = arg.target;
        let location = config.getElementLocation();
        config.getRoot().getIdeHelper().setTargetElementWidthId(config.getId(), arg.postion);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event: any): boolean {
        // console.log("mousedown-" + this.config.getId());
        // this.config.getRoot().getIdeHelper().select(this.config.getId());
        /*
        this.config.getRoot().getIdeHelper().selected = this.config;
        this.config.getRoot().getIdeHelper().selected = {
            config: this.config,
            location: this._getLocation()
        }
        console.log(this.config.getRoot().getIdeHelper().selected);
        */
        // console.log('==> mousedown:',event);
        // if (event.which == 1) {
            //right click
            this.config.getRoot().getIdeHelper().setPreAddWithId(this.config.getId());
        // }

        event.stopPropagation();
        event.preventDefault();
        return false;
    }



    @HostListener('mouseup', ['$event'])
    onMouseup(event: any): boolean {
        console.log(event);
        // if (event.which == 1) {
            this.config.getRoot().getIdeHelper().setTargetElementWidthIdAndCalculateResult(
                this.config.getId(),
                this.getPostion(event),
                event.which != 1,
                { top: event.clientY, left: event.clientX }
            );
        // }


        event.stopPropagation();
        event.preventDefault();
        // console.log("mouseup-" + this.config.getId());
        //if selected == hovered => selected
        //else accept | not accept 

        return false;
    }
    
    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: any): boolean {
        console.log(event);
        //screenX: 419, screenY: 256, clientX: 
        // this.config.getRoot().getIdeHelper().setRightClick(this.config.getId(), { top: event.clientY, left: event.clientX });
        return false;
    }
    

}
