import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';
import { AuthService } from '../../providers/auth-service';
import { MapPage } from '../map/map';


@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html',
    providers: [ItemService, AuthService],
})

export class DetailPage {
    public lat: number;
    public lng: number;
    public zoom: number;
    public item: any;
    public comments: any[];
    public commentForm: any;
    public placeholder_comment: string = "댓글 달기";
    public comment_disabled: boolean = false;

    public detailSlideOptions = {
        initialSlide: 1,
        pager: true,
        centeredSlides: true,
        zoom: true
    };

    constructor(public navCtrl: NavController,
                public params:NavParams,
                private formBuilder: FormBuilder,
                public authService: AuthService,
                public itemService: ItemService) {

        this.item = params.get("item");
        this.commentForm = this.formBuilder.group({
            'comment': [{value: '', disabled: true},
                        Validators.compose([Validators.required])]
        });

        if (!this.authService.isAuthorized()) {
            this.placeholder_comment = "로그인후 댓글을 달 수 있습니다";
        }
    }

    ionViewDidLoad() {
        this.loadItem(this.item);
        this.loadComment();

        if (!this.authService.isAuthorized()) {
            this.comment_disabled = true;
        }
    }

    loadItem(item) {
        this.itemService.loadItem(item.properties.pk)
            .subscribe(data => {
                this.lat = data['geometry']['coordinates'][1];
                this.lng = data['geometry']['coordinates'][0];
                this.zoom = 14;
            });
    }

    loadComment() {
        let params: URLSearchParams = new URLSearchParams();
        params.set('object_pk', this.item.properties.pk);

        this.itemService.loadComment(params)
            .subscribe(res => {
                this.comments = res;
            });
    }

    postComment() {
        if (!this.authService.isAuthorized()) {
            alert("[정보] 로그인후 댓글을 달 수 있습니다.");
            return;
        }

        this.commentForm.value['content_type'] = 8; // content type of Item
        this.commentForm.value['site'] = 1;
        this.commentForm.value['user_name'] = this.authService.user.username;
        this.commentForm.value['user'] = this.authService.user.pk;
        this.commentForm.value['object_pk'] = this.item.properties.pk;

        this.itemService.postComment(this.commentForm.value)
            .subscribe(response => {
                this.comments.unshift(response);
                this.commentForm.reset();
            },
                       error => {
                if (error.status == 403){
                    alert("[정보] 로그인후 사진을 업로드 할 수 있습니다.")
                }
                else {
                    alert("[정보] 사진 업로드에 문제가 있습니다.");
                }
                       });
    }

    showMap() {
        this.navCtrl.push(MapPage, {
            lat: this.lat,
            lng: this.lng,
            zoom: this.zoom
        });
    }
}
