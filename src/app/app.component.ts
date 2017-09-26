import { Component, Inject } from '@angular/core';
import { AppService } from './app.service';
import { CObject } from './c-object';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/style/dist/bulma.css']
})
export class AppComponent {

  parentDomain: string = 'http://localhost:4201';

  constructor(private appService: AppService, @Inject("windowRef") private windowRef: Window) {
    //desinger helper
    // drag source > target > 
    // select 
    let that = this;
    windowRef.addEventListener('message', function (e) {
      if (e.data && e.data.op == 'ide') {
        that._onIdeMessage(e.data);
      }
    })
  }

  _onIdeMessage(message: any): void {
    // console.log(message);
    if (message.type == 'setSelected') {
      if (message.id) {
        let find: CObject = this.config.findChildById(message.id);
        if (find) {
          this.config.getIdeHelper().select(message.id);
        }
      }
    } else if (message.type == 'setPreAdd') {
      if (message.config) {
        this.config.getIdeHelper().setPreAdd(message.config);
      }
    } else if (message.type == 'clearPreAdd') {
      this.config.getIdeHelper().clearPreAdd();
    } else if (message.type == 'setConfig') {
      if (!message.config.ideHelp) {
        message.config.ideHelp = {};
      }
      // if(!message.config.ideHelp.parentDomain) {
      //   message.config.ideHelp.parentDomain = this.parentDomain;
      // }
      this.config = new CObject(message.config);
      this.config.getIdeHelper().parentDomain = this.parentDomain;
      this.config.getIdeHelper().setConfig(this.config);
    } else if (message.type == 'setTargetElementWidthIdAndCalculateResult') {
      if (message.id) {
        this.config.getIdeHelper().setTargetElementWidthIdAndCalculateResult(message.id, message.direction, false, { left: 0, top: 0 });
      }
    } else if (message.type == 'setTargetElementWidthId') {
      if (message.id) {
        this.config.getIdeHelper().setTargetElementWidthId(message.id, message.direction);
      }
    } else if (message.type == 'setPreAddWithId') {
      if (message.id) {
        this.config.getIdeHelper().setPreAddWithId(message.id);
      }
    } else if (message.type == 'clearContextMenu') {
      this.config.getIdeHelper().clearRightClick();
    } else if (message.type == 'updateConfig') {
      if (message.id && message.config) {

        this.config.getIdeHelper().updateConfig(message.id, message.config, message.undoRedo);
      }
    } else if (message.type == 'deleteNode') {
      if (message.id) {

        this.config.getIdeHelper().remove(message.id, message.undoRedo, true);
      }
    } else if (message.type == 'addNode') {
      if (message.pid) {

        this.config.getIdeHelper().add(message.pid, new CObject(message.config), message.index, message.undoRedo, true);
      }
    } else if (message.type == 'moveNode') {
      if (message.containerId) {
        this.config.getIdeHelper().move(message.containerId, message.toAddId, message.index, message.undoRedo);
      }
    }
  }

  ngAfterViewInit(): void {
    parent.postMessage({ type: 'workspaceReady' }, this.parentDomain);

    /*
    this.appService.getConfig().then(config => {
      this.config = config;
      this.config.getIdeHelper().setConfig(this.config);
      console.log(config);
    });
    */
  }

  addConfig(): void {
    console.log('add click');
    this.config.addComponentByParentId(this.config.getIdeHelper().selected.config.id, 0, new CObject({ type: 'div' }));
  }

  config: CObject;

  get configStr(): string {
    return JSON.stringify(this.config);
  }



}
