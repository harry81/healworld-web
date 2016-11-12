import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    public data: any;
    public url: string= 'http://saveworld-backend.gm347t2p7n.ap-northeast-2.elasticbeanstalk.com/api-item';

    constructor(public http: Http) {
        console.log('Hello ItemService Provider');
    }

    load() {
        if (this.data) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {
            this.http.get(this.url)
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

}
