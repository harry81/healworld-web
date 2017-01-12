import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

declare var fooga:Function;

@Injectable()
export class GeoService {
    public position: any;
    public gmapUrl: string= 'https://maps.googleapis.com/maps/api/geocode/json\?types\=political';
    public gmapKey: string= 'AIzaSyDRCEiyDSW4JsDxFe7bJ17w9cpnLljvEQA';


    constructor(public http: Http) {
    }

    getPosition() {
        // http://stackoverflow.com/questions/37296876/my-position-gets-returned-too-fast-how-to-make-a-promise
        fooga('send', 'event', 'Geo-service', 'getPosition');

        let promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.position = position;
                    sessionStorage.setItem('position',
                                         JSON.stringify({lat: position.coords.latitude,
                                                         lng: position.coords.longitude}));
                    resolve(position);
                },
                (error) => {
                    fooga('send', 'event', 'Geo-service', error.message);
                    console.log('message', error.message);
                    reject(error);
                }
            );
        });

        return promise;
    }

    getAddress () {
        let params: URLSearchParams = new URLSearchParams();
        let coord = JSON.parse(sessionStorage.getItem('position'));
        if (coord !== null)
            params.set('latlng', `${coord.lat},${coord.lng}`);

        params.set('language', 'ko');
        params.set('location_type', 'APPROXIMATE');
        params.set('result_type', 'political|sublocality|postal_code');
        params.set('key', this.gmapKey);

        return this.http
            .get(this.gmapUrl, {search: params})
            .map(response => response.json());
    }
}
