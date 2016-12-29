import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeoService {
    public position: any;
    public address: any;

    public gmapUrl: string= 'https://maps.googleapis.com/maps/api/geocode/json\?types\=political';
    public gmapKey: string= 'AIzaSyDRCEiyDSW4JsDxFe7bJ17w9cpnLljvEQA';


    constructor(public http: Http) {
        console.log('Hello GeoService Provider');
    }

    getPosition() {
        // http://stackoverflow.com/questions/37296876/my-position-gets-returned-too-fast-how-to-make-a-promise
        let promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.position = position;
                    this.address = this.getAddress(
                        this.position.coords.latitude,
                        this.position.coords.longitude);
                    resolve(position);
                },
                (error) => {
                    console.log('message', error.message);
                    reject('https://www.healworld.co.kr 로 접속하여 주세요.');

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
        params.set('location_type', 'APPROXIMATE');
        params.set('result_type', 'political|sublocality|postal_code');
        params.set('key', this.gmapKey);

        return this.http
            .get(this.gmapUrl, {search: params})
            .map(response => response.json());
    }


}
