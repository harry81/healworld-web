import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { URLSearchParams } from '@angular/http';
import { ItemService } from '../../providers/item-service';
import { GeoService } from '../../providers/geo-service';

declare var fooga:Function;

@Component({
    selector: 'page-myitem',
    templateUrl: 'myitem.html',
    providers: [ItemService, GeoService]
})
export class MyitemPage {
    public response: any;
    public user: any;
    public items: Array<any> = [];

    public params: URLSearchParams = new URLSearchParams();

    constructor(public navCtrl: NavController
                ,public itemService: ItemService
                ,public alertCtrl: AlertController
                ,public geoService: GeoService
               ) {
        fooga('send', 'pageview', 'MyItemPage');
    }

    ionViewDidLoad() {
        console.log('Hello MyitemPage Page');
    }

    ionViewDidEnter() {
        this.user = JSON.parse(localStorage.getItem('user'));

        if (this.user == undefined )
            return;

        if (this.user) {
            this.params.set('user', this.user.pk);
        }
        this.loadItems();
    }

    deleteItem(item) {
        fooga('send', 'event', 'MyItemPage', 'delete', item.properties.pk);

        if (this.user == undefined ) {
            return;
        }

        let params = {action: 'delete',
                      item_id: item.properties.pk};

        this.itemService.patchItemAction(params)
            .subscribe(data => {
                this.response = data;
                console.log('data loaditem', data);
            });
    }

    loadItems(overwrite=false){
        if (this.user == undefined ) {
            this.items = null;
            return;
        }

        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.items = data.results.features;
                this.response = data;
                console.log('data loaditem', data);
            });
    }

    showConfirm(item) {
        let confirm = this.alertCtrl.create({
            title: '아이템 삭제',
            message: '삭제된 아이템은 리스트에서 조회되지 않습니다.',
            buttons: [
                {
                    text: '취소',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: '삭제',
                    handler: () => {
                        console.log('Agree clicked', item);
                        this.deleteItem(item);
                    }
                }
            ]
        });
        confirm.present();
        fooga('send', 'event', 'MyItemPage', 'showConfirm', item.properties.pk);
    }

}
