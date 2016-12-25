import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    public baseUrl: string= 'http://localhost:8000/';
    public user: any;

    constructor(private authHttp: AuthHttp
                ,private _cookieService: CookieService) {

        this.setBaseUrl();
        this.setUserInfo();
    }

    setBaseUrl() {
        if (window.location.href.indexOf('healworld.co.kr') > -1)
            this.baseUrl = 'https://backend.healworld.co.kr/';
    }

    isAuthorized() {
        let id_token = localStorage.getItem('id_token');
        return tokenNotExpired() && id_token;
    }

    loggedOut() {
        this._cookieService.put('jwt_token', null);
        localStorage.clear();
    }

    getUserInfo() {
        let url = this.baseUrl + 'api-profile/info/';

        return this.authHttp.get(url)
            .map(res => res.json());
    }

    setUserInfo() {
        let jwt_token = this._cookieService.get('jwt_token');

        if ( jwt_token == undefined )
            return;

        localStorage.setItem('id_token', jwt_token);
        this.getUserInfo()
            .subscribe(data => {
                let user = JSON.stringify(data)
                localStorage.setItem('user', user);
                this.user = JSON.parse(user);
            });
    }

}
