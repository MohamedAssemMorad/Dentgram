import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'page-library-details',
  templateUrl: 'library-details.html',
})
export class LibraryDetailsPage {


  id: any;
  name: any;
  description: any;
  image_full: any;
  image_thumb: any;
  model: any;
  length: any;
  width: any;
  height: any;
  weight: any;
  category_id: any;
  category_name: any;
  category_display_name: any;
  category_icon_full: any;
  category_icon_thumb: any;
  man_id: any;
  man_name: any;
  man_icon_full: any;
  man_icon_thumb: any;
  attributes: any;
  slides_list: any;
  spes: any;

  allData: any;
  imageMain: any;

  isDataAvilable = false;
  galleryType = 'regular';
  secretId = "";
  bestrecommended: any[];

  lib_books: any[];
  lib_videos: any[];
  category_data: any[];

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            private youtube: YoutubeVideoPlayer,
            private photoViewer: PhotoViewer) {


          this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          this.secretId = this.navParams.get('secretId');

          this.allData = [];
          this.mainFunc.dismissLoading();
          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
    this.viewCtrl.setBackButtonText('');

    

    let url = this.mainFunc.url + '/api/structure/' + this.secretId + '/view/' + this.id;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
        console.log('Remote Course Details Data = ' + data);  
        this.attributes = [];
        this.slides_list = [];
        this.spes = [];
        this.imageMain = [];
        this.lib_books = [];
        this.lib_videos = [];
        this.category_data = [];

        if (data.id != null && data.id != ''){
          this.isDataAvilable = true;
        
          this.allData = data;
          this.slides_list = data.gallery;
          this.imageMain = data.image.full;
          if (data.videos) {
            this.lib_videos = data.videos;
          }
          if (data.books) {
            this.lib_books = data.books;
          }
          

          // this.image_full = data.image.full;
          // this.image_thumb = data.image.thumb;
          // this.model = data.model;
          // this.length = data.length;
          // this.width = data.width;
          // this.height = data.height;
          // this.weight = data.weight;
          // this.category_id = data.category.id;
          // this.category_icon_full = data.category.icon.full;
          // this.category_icon_thumb = data.category.icon.thumb;
          // this.man_id = data.manufacturer.id;
          // this.man_icon_full = data.manufacturer.icon.full;
          // this.man_icon_thumb = data.manufacturer.icon.thumb;
          // this.attributes = data.attribute_groups;
          // this.slides_list = data.gallery;


          // let item = {
          //   "name": ,
          //   "value": 
          // }
          // this.spes.push(item);


          if (this.platform.dir() === "rtl") {
            // this.name = data.name_ar;
            // this.description = data.description_ar;
            // this.category_name = data.category.name_ar;
            this.category_display_name = data.category.display_name_ar;
            // this.man_name = data.manufacturer.name_ar;
          } else {
            // this.name = data.name_en;
            // this.description = data.description_en;
            // this.category_name = data.category.name_en;
            this.category_display_name = data.category.display_name_en;
            // this.man_name = data.manufacturer.name_en;          
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });
  }


  addToCart(id,item){
    console.log('Add item id = ' + id);
    
    this.mainFunc.cartItems.push(id);
    this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    this.mainFunc.checkItemInCart(id);
  }
  addToCartFinished(item){
    // this.cartBadgeState = 'idle';
    // item.addButtonState = 'idle';
  }
  addToFav(item){
    this.mainFunc.addToFav(item);
  }
  removeFromFav(item){

  }
  openItemDetails(id) {
    // this.navCtrl.push(ItemDetailsPage);
  }
  openImage(url){
    this.photoViewer.show(url);
  }

  openBook(url,title){
    url = encodeURI(url);
    // let browser = this.iab.create(url);
    // browser.show();
    window.open(url, '_system');
    // let options: DocumentViewerOptions = {
    //   title: title
    // }

    // this.document.viewDocument(url, 'application/pdf', options)
  }

  openVideo(url,title) {
    url = encodeURI(url);
    this.youtube.openVideo(url);
  }

  getYoutubeImage (url) {

    let newUrl = 'https://img.youtube.com/vi/' + url + '/hqdefault.jpg';
    // console.log(newUrl);
    return newUrl;
  }
}

