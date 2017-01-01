import { Component } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { URLSearchParams } from '@angular/http';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';
import { GeoService } from '../../providers/geo-service';
import { AuthService } from '../../providers/auth-service';
import { DetailPage } from '../detail/detail';
import { PostPage } from '../post/post';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
    providers: [ItemService, AuthService, GeoService]
})

export class ListPage {
    public items: Array<any> = [];
    public items_count: Number = 0;
    public next_url: string;
    public loader: any;
    public address: any = "전국";

    public params: URLSearchParams = new URLSearchParams();
    public dist: Number;
    public search: string;

    constructor(public navCtrl: NavController
                ,public loadingCtrl: LoadingController
                ,private toastCtrl: ToastController
                ,public itemService: ItemService
                ,public authService: AuthService
                ,public geoService: GeoService
                ,private _cookieService: CookieService) {

        this.params.set('search', ``);
        this.params.set('state', `created`);
        this.params.set('dist', '100000');
        this.authService.setUserInfo();
        this.geoService.getPosition();
    }

    ionViewWillEnter() {
    }

    ionViewDidLoad() {
        if (this.items.length == 0)
            this.loadItems(true);
    }

    updateItem(data, overwrite=false){

        for (let idx_data in data.results.features) {
            let obj = data.results.features[idx_data];
            this.items_count = data.count;

            if (data.request_query) {
                this.dist = Number(data.request_query['dist']) / 1000
                this.search = data.request_query['search']
            }

            let exist = false;

            for (let idx_item in this.items) {
                if (this.items[idx_item].properties.pk == obj.properties.pk){
                    exist = true;
                    break;
                }
            }

            if (exist == false){
                if (data.previous != null)
                    this.items.push(obj);
                else {
                    this.items.unshift(obj);
                }
            }
        }

        this.next_url = data.next;
    }

    loadItems(overwrite=false){
        this.loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });

        this.loader.present();

        this.geoService.getPosition()
            .then(position =>{
                this.params.set('point',
                                `${this.geoService.position.coords.longitude},${this.geoService.position.coords.latitude}`);

                this.itemService.loadItems(this.params)
                    .subscribe(data => {
                        this.updateItem(data, overwrite);
                        this.loader.dismiss();
                    });
            },
                  error => {
                      switch(error.code) {
                      case error.PERMISSION_DENIED:
                          this.presentToast('현재 위치 검색을 위해 주소를 이동합니다. https://www.healworld.co.kr', 3000);
                          window.location.href = "https://www.healworld.co.kr";
                          break;
                      default:
                          alert(error);
                      }
                  });
    }

    itemTapped(item, event) {
        this.navCtrl.push(DetailPage, {
            item: item
        });
    }

    addItem() {
        this.navCtrl.push(PostPage);
    }

    doRefresh(refresher) {
        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.updateItem(data);
                refresher.complete();
            });
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if (this.next_url != null)
                this.itemService.loadItemsbyUrl(this.next_url)
                .subscribe(data => {
                    this.updateItem(data);
                })
            infiniteScroll.complete();
        }, 500);
    }

    onSearchInput(ev){
        let val = ev.target.value;
        this.params.set('search', val);
        this.loadItems(true);
    }


    locatePosition() {
        let distance : number = 10;

        if (this.address != "전국") {
            this.params.set('dist', '100000');
            this.address = "전국";
            this.loadItems(true);
        }

        else {
            // step 1) set positional argument
            distance = distance * 1000;
            this.params.set('dist', distance.toString());

            // step 2) show address for user
            this.geoService.address.subscribe((response) => {
                console.log(response['results'][0]);
                this.address = response['results'][0]['formatted_address'];
            });

            // step 3) load items based on the position
            this.loadItems(true);
        }
    }

    get_token() {
        this.itemService.get_token()
            .subscribe(data => {
                console.log(data);
            });
        console.log('login');
    }

    presentToast(message, time) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: time,
            position: 'middle'
        });

        toast.present();
    }

}
