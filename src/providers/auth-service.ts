import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    public baseUrl: string= 'http://localhost:8000/';

    constructor(private authHttp: AuthHttp
                ,private _cookieService: CookieService) {

        let jwt_token = this._cookieService.get('jwt_token');

        if ( jwt_token != undefined ) {
            localStorage.setItem('id_token', jwt_token);
        }
    }

    isAuthorized() {
        return tokenNotExpired();
    }

    loggedOut() {
        localStorage.setItem('id_token', null);
    }

    getUserInfo() {
        // this.baseUrl = 'https://backend.healworld.co.kr/';
        let url = this.baseUrl + 'api-profile/info/';

        return this.authHttp.get(url)
            .map(res => res.json());
    }


}
