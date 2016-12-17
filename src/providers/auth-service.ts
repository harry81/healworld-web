import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    public storage = new Storage();

    constructor(private authHttp: AuthHttp
                ,private _cookieService: CookieService) {

        this.storage.set('id_token', this._cookieService.get('jwt_token'));
        console.log(this.storage.get('id_token'));
    }

    authenticated() {
        this.storage.get('id_token').then(token => {
            console.log(tokenNotExpired(null, token)); // Returns true/false
        });
    }
}
