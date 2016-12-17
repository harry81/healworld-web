import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

    constructor(private authHttp: AuthHttp
                ,private _cookieService: CookieService
                ,public storage: Storage) {

        let jwt_token_test = this._cookieService.get('jwt_token_test');
        let jwt_token = this._cookieService.get('jwt_token');

        this.storage.set('jwt_token_test', jwt_token_test);
        this.storage.set('id_token', jwt_token);

        this.storage.get('jwt_token_test').then(token => {
            console.log('storage - jwt_token_test', token);
        });

        this.storage.get('id_token').then(token => {
            console.log('storage - id_token', token);
        });

        this.storage.get('storage_test').then(token => {
            console.log('storage - storage_test', token);
        });
    }

    authenticated() {
        this.storage.get('id_token').then(token => {
            console.log(tokenNotExpired(null, token)); // Returns true/false
        });
    }

    loggedIn() {
        return tokenNotExpired();
    }
}
