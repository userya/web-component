import { Injectable } from '@angular/core';
import { CObject } from './c-object';

@Injectable()
export class AppService {
    getConfig(): Promise<CObject> {
        let config = new CObject();
        return Promise.resolve(config);
    }
}
