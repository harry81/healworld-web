import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { URLSearchParams } from '@angular/http';
import { ItemService } from '../../providers/item-service';
import { GeoService } from '../../providers/geo-service';


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
                ,public geoService: GeoService
               ) {}

    ionViewDidLoad() {
        console.log('Hello MyitemPage Page');
    }

    ionViewWillEnter() {
        this.user = localStorage.getItem('user');

        if (this.user == undefined )
            return;

        this.params.set('state', `created`);

        if (this.user) {
            this.params.set('user', this.user.pk);
        }
        this.loadItems();
    }

    deleteItem(item) {
        console.log(item);
    }

    loadItems(overwrite=false){
        let user = localStorage.getItem('user');

        if (user == undefined ) {
            this.items = null;
            return;
        }

        this.geoService.getPosition()
            .then(position =>{
                this.params.set('point',
                                `${this.geoService.position.coords.longitude},${this.geoService.position.coords.latitude}`);

                this.itemService.loadItems(this.params)
                    .subscribe(data => {
                        this.items = data.results.features;
                        this.response = data;
                        console.log('data loaditem', data);
                    });
            },
                  error => {
                      switch(error.code) {
                      case error.PERMISSION_DENIED:
                          break;
                      default:
                          alert(error);
                      }
                  });
    }

}
