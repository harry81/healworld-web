import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { AlertController} from 'ionic-angular';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    public baseUrl: string= 'http://localhost:8000/';
    public user: any;

    constructor(private authHttp: AuthHttp
                ,public http: Http
                ,public alertCtrl: AlertController
                ,private _cookieService: CookieService) {

        this.setBaseUrl();
    }

    setBaseUrl() {
        if (window.location.href.indexOf('healworld.co.kr') > -1)
            this.baseUrl = 'https://backend.healworld.co.kr/';
    }

    isAuthorized() {
        let id_token = localStorage.getItem('id_token');
        return tokenNotExpired() && id_token;
    }

    signup(formData) {
        let url = this.baseUrl + 'rest-auth/registration/';

        return this.http.post(url, formData)
            .map(res => res.json());
    }

    loggedOut() {
        this.session_logout()
            .subscribe(data => {
                console.log(data);
                this._cookieService.remove('jwt_token', { path: '/' , domain: '.healworld.co.kr'});
                this._cookieService.remove('sessionid', {
                    path: '/' ,
                    domain: '.healworld.co.kr'
                    ,expires: 'Thu, 01 Jan 1970 00:00:00 GMT'});
                this._cookieService.removeAll();
                localStorage.clear();
            });
    }

    session_logout() {
        let url = this.baseUrl + 'api-profile/logout/';
        return this.http.get(url,  {
            withCredentials: true})
            .map(res => res.json());
    }

    getUserInfo() {
        let url = this.baseUrl + 'api-profile/info/';

        return this.authHttp.get(url)
            .map(res => res.json());
    }

    setUserInfo() {
        let jwt_token = this._cookieService.get('jwt_token');

        if ( jwt_token == undefined ) {
            this.loggedOut();
            return;
        }

        localStorage.setItem('id_token', jwt_token);
        this.getUserInfo()
            .subscribe(data => {
                let user = JSON.stringify(data);
                localStorage.setItem('user', user);
                this.user = JSON.parse(user);
            });
    }

    showGoLoginConfirm(message="") {
        let confirm = this.alertCtrl.create({
            title: '로그인',
            message: message + ' 등록하려면 로그인이 필요합니다.',
            buttons: [
                {
                    text: '아니오',
                    handler: () => {
                    }
                },
                {
                    text: '네',
                    handler: () => {
                        window.location.href = "/#/profile";
                    }
                }
            ]
        });
        confirm.present();
    }

}
