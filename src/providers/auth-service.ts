import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

    constructor(private authHttp: AuthHttp
                ,private _cookieService: CookieService) {

        let jwt_token = this._cookieService.get('jwt_token');

        if ( jwt_token != undefined ) {
            localStorage.setItem('id_token', jwt_token);
        }
    }

    loggedIn() {
        return tokenNotExpired();
    }

    loggedOut() {
        localStorage.setItem('id_token', null);
    }
}
