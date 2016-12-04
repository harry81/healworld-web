import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {
    public data: any;

    // public baseUrl: string= 'https://backend.healworld.co.kr/';
    public baseUrl: string= 'http://localhost:8000/';
    public gmapUrl: string= 'https://maps.googleapis.com/maps/api/geocode/json\?types\=political';
    public gmapKey: string= 'AIzaSyDRCEiyDSW4JsDxFe7bJ17w9cpnLljvEQA';

    constructor(public http: Http) {
        console.log('Hello ItemService Provider');
    }


    loadItem(item_id="", next_url="") {
        let url = this.baseUrl + 'api-item/';
        if (item_id != ''){
            url = url + item_id + '/';
        }

        if (next_url != ''){
            url = next_url;
        }
        console.log('url', url);

        return new Promise(resolve => {
            this.http.get(url)
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

        return new Promise(resolve => {
            this.http
                .post(this.baseUrl + 'api-image/',
                      formData)
                .map(response => response.json())
                .subscribe(
                    response => {
                        resolve(response);
                    }
                );
        })
    }

    postItem(formData){
        return new Promise(resolve => {
            this.http
                .post(this.baseUrl + 'api-item/',
                      formData)
                .map(response => response.json())
                .subscribe(
                    response => {
                        resolve(response);
                    }
                );
        })
    }

    getPosition() {
        // http://stackoverflow.com/questions/37296876/my-position-gets-returned-too-fast-how-to-make-a-promise
        console.log('Getting position');
        let promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve(position);
                },
                (error) => {
                    console.log('message', error.message);
                    reject('code: '    + error.code    + '\n' +
                           'message: ' + error.message + '\n');
                },
                {
                    enableHighAccuracy: true
                }
            );
        });

        return promise;
    }

    getAddress (lat, lng) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('latlng', `${lat},${lng}`);
        params.set('language', 'ko');
        params.set('location_type', 'ROOFTOP');
        params.set('key', this.gmapKey);

        return new Promise(resolve => {
            this.http
                .get(this.gmapUrl , {search: params})
                .map(response => response.json())
                .subscribe(
                    response => {
                        resolve(response);
                    }
                );
        })

    }

}
