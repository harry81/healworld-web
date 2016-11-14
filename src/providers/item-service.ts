import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    public data: any;
    // public baseUrl: string= 'http://saveworld-backend.gm347t2p7n.ap-northeast-2.elasticbeanstalk.com/';
    public baseUrl: string= 'http://localhost:8000/';

    constructor(public http: Http) {
        console.log('Hello ItemService Provider');
    }

    loadItem() {
        if (this.data) {
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {
            this.http.get(this.baseUrl + 'api-item/')
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

    postImage(file){
        let formData = new FormData();

        formData.append("itemshot", file);
        formData.append("item", 1);

        console.log('post Image', file);

        this.http
            .post(this.baseUrl + 'api-image/',
                  formData)
            .map(response => response.json())
            .subscribe(
                response => console.log('uploading an image Complete', response),
                this.logError,
                () => console.log('Authentication Complete')
            );
    }

}
