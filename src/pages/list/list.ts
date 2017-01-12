import { Component } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { URLSearchParams } from '@angular/http';
import { NavController, LoadingController,
         ModalController,
         AlertController} from 'ionic-angular';
import { ItemService } from '../../providers/item-service';
import { GeoService } from '../../providers/geo-service';
import { AuthService } from '../../providers/auth-service';
import { DetailPage } from '../detail/detail';
import { SearchPage } from '../search/search';
import { PostPage } from '../post/post';

declare var fooga:Function;

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

    public detailSlideOptions = {
        initialSlide: 0,
        zoom: true
    };

    constructor(public navCtrl: NavController
                ,public loadingCtrl: LoadingController
                ,public itemService: ItemService
                ,public authService: AuthService
                ,public geoService: GeoService
                ,public modalCtrl: ModalController
                ,public alertCtrl: AlertController
                ,private _cookieService: CookieService) {

        fooga('send', 'pageview', 'ListPage');

        this.params.set('search', ``);
        this.params.set('state', `created`);
        this.params.set('dist', '100000');
        this.authService.setUserInfo();
    }

    ionViewWillEnter() {
        if (this.items.length == 0)
            this.loadItems(true);
    }

    ionViewDidLoad() {
        fooga('send', 'event', 'List', 'open');
    }

    updateItem(data, overwrite=false){
        if (overwrite == true) {
            this.items = data.results.features;
        }

        else {
            for (let idx_data in data.results.features) {
                let obj = data.results.features[idx_data];

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
        }

        this.items_count = data.count;

        data.request_query['dist'] = "";

        if (data.request_query) {
            if ('dist' in data.request_query)
                this.dist = Number(data.request_query['dist']) / 1000
            this.search = data.request_query['search']
        }

        this.next_url = data.next;
    }

    loadItems(overwrite=false){
        try {
            let coord = JSON.parse(sessionStorage.getItem('position'));
            if (coord !== null)
                this.params.set('point', `${coord.lng},${coord.lat}`);
        }
        catch(error){
            console.log('getAddress error', error);
            return;
        };

        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.updateItem(data, overwrite);
            });
    }

    itemTapped(item, event) {
        this.navCtrl.push(DetailPage, {
            item: item.properties.pk
        });
    }

    openSearch() {
        let searchModal = this.modalCtrl.create(SearchPage);
        searchModal.onDidDismiss(data => {

            if (data !== null && data.hasOwnProperty('search')) {
                this.params.set('search', data['search']);
                this.params.set('dist', data['dist']);
                this.locatePosition();
            }

        });

        searchModal.present();
    }

    addItem() {
        fooga('send', 'event', 'addItem', 'click', 'add button');

        if (!this.authService.isAuthorized()) {
            fooga('send', 'event', 'addItem', 'login required',);

            this.showGoLoginConfirm();
            return;
        }

        let addItemModal = this.modalCtrl.create(PostPage);

        addItemModal.onDidDismiss(data => {
            if (data)
                this.locatePosition();
        });

        addItemModal.present();
        fooga('send', 'event', 'addItem', 'open', 'PostPage');
    }

    doRefresh(refresher) {
        fooga('send', 'event', 'ListPage', 'reFresh');

        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.updateItem(data);
                refresher.complete();
            });
    }

    doInfinite(infiniteScroll) {
        fooga('send', 'event', 'ListPage', 'doInfinite');
        if (this.next_url === null){
            infiniteScroll.complete();
            return;

        }

        setTimeout(() => {
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
        this.loadItems(true);
    }

    get_token() {
        this.itemService.get_token()
            .subscribe(data => {
                console.log(data);
            });
        console.log('login');
    }



    getposition() {
        this.geoService.getPosition()
            .then(data => {
                console.log('data', data);
            }, error => {
                console.log('error', error);
            });
    }

    showGoLoginConfirm() {
        let confirm = this.alertCtrl.create({
            title: '로그인',
            message: '아이템을 등록하려면 로그인이 필요합니다.',
            buttons: [
                {
                    text: '아니오',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: '네',
                    handler: () => {
                        console.log('Agree clicked');
                        window.location.href = "/#/profile";
                    }
                }
            ]
        });
        confirm.present();
        fooga('send', 'event', 'alertCtrl', 'login required');
    }
}
