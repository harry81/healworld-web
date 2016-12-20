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

        let jwt_token = this._cookieService.get('jwt_token');
        if ( jwt_token != undefined ) {
            localStorage.setItem('id_token', jwt_token);
        }
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
        localStorage.setItem('id_token', null);
    }

    getUserInfo() {
        let url = this.baseUrl + 'api-profile/info/';

        return this.authHttp.get(url)
            .map(res => res.json());
    }

    setUserInfo() {
        this.getUserInfo()
            .subscribe(data => {
                localStorage.setItem('user', JSON.stringify(data));

                this.user = JSON.parse(localStorage.getItem('user'));
                this.username = this.user.username;

            });
    }

}
