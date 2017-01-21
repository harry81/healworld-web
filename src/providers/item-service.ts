import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    public data: any;
    public position: any;
    public address: any;

    public baseUrl: string= 'http://localhost:8000/';

    constructor(public http: Http,
               public authHttp: AuthHttp) {
        this.setBaseUrl();
    }

    setBaseUrl(){
        if (window.location.href.indexOf('healworld.co.kr') > -1)
            this.baseUrl = 'https://backend.healworld.co.kr/';
    }

    loadItems(params) {
        let url = this.baseUrl + 'api-item/';

        return this.http.get(url, {search: params})
            .map(res => res.json());
    }

    loadItemsbyUrl(url) {
        return this.http.get(url)
            .map(res => res.json());
    }

    loadItem(item_id, params) {
        let url = this.baseUrl + 'api-item/';

        if (item_id != ''){
            url = url + item_id + '/';
        }

        return this.http.get(url, {search: params})
            .map(res => res.json());
    }

    postImage(file){
        let formData = new FormData();

        formData.append("itemshot", file);
        formData.append("item", 1);

        return this.authHttp
                .post(this.baseUrl + 'api-image/',
                      formData)
                .map(response => response.json());
    }

    postItem(formData){
        return this.authHttp
            .post(this.baseUrl + 'api-item/',
                  formData)
            .map(response => response.json());
    }

    patchItem(formData){
        return this.authHttp
            .patch(this.baseUrl + 'api-item/',
                  formData)
            .map(response => response.json());
    }

    patchProfile(formData){
        return this.authHttp
            .patch(this.baseUrl + 'api-profile/',
                  formData)
            .map(response => response.json());
    }

    loadComment(params) {
        let url = this.baseUrl + 'api-comment/';

        return this.http.get(url, {search: params})
                .map(res => res.json());
    }

    postComment(formData){
        return this.authHttp
            .post(this.baseUrl + 'api-comment/',
                  formData)
            .map(response => response.json());
    }

    get_token() {
        let url = this.baseUrl + 'get_token/';

        return this.http.get(url)
            .map(res => res.json());
    }
}
