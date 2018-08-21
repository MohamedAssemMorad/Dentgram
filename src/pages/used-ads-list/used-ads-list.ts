import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Slides, ActionSheetController, Platform, Content } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import { ItemDetailsStorePage } from "../../pages/item-details-store/item-details-store";
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { UsedAdsDetailsPage } from "../../pages/used-ads-details/used-ads-details";
import { UsedAdsPage } from "../../pages/used-ads/used-ads";
import { TranslateService } from '@ngx-translate/core';
import { AccountfPage } from "../../pages/accountf/accountf";

import { SearchPage } from "../../pages/search/search";


@Component({
  selector: 'page-used-ads-list',
  templateUrl: 'used-ads-list.html',
  animations: [
    trigger('cartBadge', [
        state('idle', style({
            opacity: '1',
            transform: 'scale(1)'
        })),
        state('adding', style({
            opacity: '0.5',
            transform: 'scale(1.4)'
        })),
        transition('idle <=> adding', animate('300ms linear')),
        transition('void => *', [
            style({transform: 'translateX(200%)'}),
            animate('500ms ease-in-out')
        ])
    ]),
    trigger('addButton', [
        state('idle', style({
            // opacity: '1'
        })),
        state('adding', style({
            // opacity: '0.3',
            //fontWeight: 'bold'
        })),
        transition('idle <=> adding', animate('500ms linear')),
        transition('void => *', [
            // style({transform: 'translateX(200%)'}),
            // animate('300ms ease-in-out')
        ])
    ])
,
    trigger('flyInOut', [
      state('cartBadge', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(500, keyframes([
          style({opacity: 1, transform: 'translateX(100%)', offset: 0.1}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)', offset: 0.5}),
          style({opacity: 1, transform: 'translateX(-100%)', offset: 0.7}),
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.9}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ])
    ])
]
})

export class UsedAdsListPage {

  catName: any;
  catId: any;
  isGrid: boolean = true;
  bestrecommended: any[];
  cartBadgeState: string = 'idle';
  mobwidth: any;
  mobheight: any;
  direc: any;
  direcR: any;
  city_id: any;
  secretid = "";
  slider_Data: any[];
  slider_Data_action: any[];
  subscription;
  isDataAvilable = true;
  current_page: number;
  can_load_more: boolean = false;

  slideInView:boolean = true;
  slideViewed:any[] = [];
  slideClicked:any[] = [];
  @ViewChild(Content)
  content:Content;

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
     public viewCtrl: ViewController, 
       private http: Http,
         public mainFunc: MainFunctionsProvider,
          public actionSheetCtrl: ActionSheetController,
            private changeDetector: ChangeDetectorRef,
              private platform: Platform,
              public storage: Storage,
              public translate: TranslateService) {


          this.viewCtrl.setBackButtonText('');
          this.catName = this.navParams.get('name') == undefined ? '': this.navParams.get('name');
          this.catId = this.navParams.get('id') == undefined ? 0: this.navParams.get('id');
          this.secretid = this.navParams.get('secretid') == undefined ? 'for_used': this.navParams.get('secretid');
          this.slider_Data = [];

          // this.storage.get('city_id').then( data => {
          //    this.city_id = data;
          // });

          // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
          // localBestRecommendeddata.subscribe(data => {
          //   this.bestrecommended = data;
          // });
          


          //////////////////////////////////////////////

          // this.mainFunc.showLoading('',true);
          this.storage.get('city_id').then((city_id) => {
            this.city_id = city_id;
            let url = this.mainFunc.url + '/api/structure/used-items/category/' + this.catId + '/' + this.city_id;
            let localHomeMenudata2 = this.http.get(url).map(res => res.json());
            localHomeMenudata2.subscribe(dataall => {
              console.log("remote buyandsell data", dataall);
              
              let data = [];
              data = dataall.used_items;
              this.slider_Data = dataall.slides;
              // this.slider_Data_action = dataall.slider_Data.action;
              let name = "";
              let data2: any[];
              data2 = [];
              if (data.length > 0){
                this.isDataAvilable = true;
                this.current_page = dataall.pages.current_page;
                this.can_load_more = dataall.pages.can_load_more;
              }else{
                this.isDataAvilable = false;
              }
              for (let index = 0; index < data.length; index++) {
                const e = data[index];
                let eicon = data[index].image.thumb;
                if (eicon === null){
                  eicon = 'assets/img/catalogue/img-1.png';
                }
                if (this.platform.dir() === "rtl") {
                  name = e.name_ar;
                } else {
                  name = e.name_en;
                }
                
                if((e.name).length >= 50){ e.name = (e.name).substr(0,50)+'...' };

                let item = {
                  "id": e.id,
                  "name": e.name,
                  "image": eicon,
                  "price": e.price,
                  "by" : e.by,
                  "currency" : e.currency,
                  "city_ar" : e.city.name_ar,
                  "city_en" : e.city.name_en
                }
                data2.push(item);
              }
              this.bestrecommended = data2;
              
            });

        });

  }

  ionViewDidEnter(currentIndex) {
    if(this.slides != undefined){
      this.content.ionScrollEnd.subscribe((data)=>{

        let dimensions = this.content.getContentDimensions();

        let scrollTop = this.content.scrollTop;
        let contentHeight = dimensions.contentHeight;
        let scrollHeight = dimensions.scrollHeight;
        let sliderHeight = document.getElementById('slider').offsetHeight;

        let sliderInView = sliderHeight - scrollTop;

        if(sliderInView < (sliderHeight - sliderHeight)){
          console.log('Slider not in view');
          this.slideInView = false;
        }else{
          console.log('Slider is in View');
          this.slideInView = true;
        }

      });
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.ionViewDidEnter(currentIndex);
    if(this.slideInView == true){
      if(this.slider_Data[Number(currentIndex - 1)] != undefined){
        let slider_id = this.slider_Data[Number(currentIndex - 1)].id;
        if(this.slideViewed.indexOf(slider_id) <= -1){
          
          let url = this.mainFunc.url+'/api/ads/slider-view/'+slider_id;
          
          this.http.get(url).map(res => res.json()).subscribe(dataAll => {
            this.slideViewed.push(slider_id);
          });
        }
      }
    }
  }

  openSlider(action,slide_id)
  {      
    if(action != null){
      this.mainFunc.openSlider(action);
      
      if(this.slider_Data[Number(slide_id)] != undefined){
        let slider_id = this.slider_Data[Number(slide_id)].id;
        if(this.slideClicked.indexOf(slider_id) <= -1){
          
          let url = this.mainFunc.url+'/api/ads/slider/'+slider_id;
          
          this.http.get(url).map(res => res.json()).subscribe(dataAll => {
            this.slideClicked.push(slider_id);
          });
        }
      }
      
    }
  }

  loadNextPage() {

    let url = this.mainFunc.url + '/api/structure/used-items/category/' + this.catId + '/' + this.city_id + '?page=' + (this.current_page + 1);
          let localHomeMenudata2 = this.http.get(url).map(res => res.json());
          localHomeMenudata2.subscribe(dataall => {
            let data = [];
            data = dataall.used_items;
            let name = "";
            let data2: any[];
            data2 = [];
            
            if (data.length > 0){
              this.isDataAvilable = true;
              this.current_page = dataall.pages.current_page;
              this.can_load_more = dataall.pages.can_load_more;
            }else{
              this.isDataAvilable = false;
            }

            for (let index = 0; index < data.length; index++) {
              const e = data[index];
              let eicon = data[index].image.thumb;
              if (eicon === null){
                eicon = 'assets/img/catalogue/img-1.png';
              }
              if (this.platform.dir() === "rtl") {
                name = e.name_ar;
              } else {
                name = e.name_en;
              }
              

              let item = {
                "id": e.id,
                "name": e.name,
                "image": eicon,
                "price": e.price,
                "by" : e.by,
                "currency" : e.currency,
                "city_ar" : e.city.name_ar,
                "city_en" : e.city.name_en
              }
              this.bestrecommended.push(item);
            }
            // this.bestrecommended = data2;
            
          });


  }

  ionViewDidLoad() {
    this.subscription = Observable.interval(3000).subscribe(x=> {
        
        try {
          this.slides.slideNext(1000);
        } catch (error) {
          
        }
      });
    console.log('ionViewDidLoad UsedAdsListPage');
    this.viewCtrl.setBackButtonText('');
    this.platform.ready().then((readySource) => {
      this.mobwidth = this.platform.width();
      this.mobheight = this.platform.height();
    });
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
  }

  showSortingActionSheet(){
    let ac_Title = "Sort By";
    let act_sub1 = "Most Matching";
    let act_sub2 = "Best Seller";
    let act_sub3 = "Top Rated";
    let act_sub4 = "Price Up";
    let act_sub5 = "Price Down";
    let act_sub6 = "Cancle";

    if (this.platform.dir() === "rtl") {
      ac_Title = "ترتيب الأصناف حسب";
      act_sub1 = "الأكثر تطابقا";
      act_sub2 = "الأكثر مبيعاً";
      act_sub3 = "الأعلى تقييما";
      act_sub4 = "الأقل سعرا";
      act_sub5 = "الأعلى سعرا";
      act_sub6 = "إلغاء";
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: ac_Title,
      buttons: [
        {

          text: act_sub1,
          // icon: 'md-albums',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub2,
          // icon: 'md-cart',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub3,
          // icon: 'md-star',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub4,
          // icon: 'md-arrow-dropup',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: act_sub5,
          // icon: 'md-arrow-dropdown',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub6,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      enableBackdropDismiss: true
    });
    
    actionSheet.present();
  }

  changeViewMode() {
    this.isGrid = !this.isGrid;
  }

  dismissview(catId){
    if(catId == 0){  
      this.navCtrl.parent.viewCtrl.dismiss();
    }else{
      this.viewCtrl.dismiss();
    }
  }


  showSearchBar() {
    this.navCtrl.push(SearchPage, {
      'type' : this.secretid
    });
  }

  addToCart(id,item){
    // this.mainFunc.cartItems.push(id);
    this.mainFunc.addToCart(id);
    // this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    item.addButtonState = 'adding';
    this.cartBadgeState = 'adding';
    this.changeDetector.detectChanges();
    this.mainFunc.checkItemInCart(id);
  }
  addToCartFinished(item){
    this.cartBadgeState = 'idle';
    item.addButtonState = 'idle';
  }
  addToFav(item){
    this.mainFunc.addToFav(item);
  }
  removeFromFav(item){
    this.mainFunc.deleteFromFav(item);
  }
  
  deleteFromCart(id){
    this.mainFunc.deleteFromCart(id);
    // this.loadData();
  }

  openItemDetails(id) {
    this.navCtrl.push(UsedAdsDetailsPage, {
      'id' : id
    });
  }

  click_Open_Category() {
    this.navCtrl.push(UsedAdsPage);
  }
  
  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
  }

  doInfinite(infiniteScroll) {
    if(this.can_load_more){
      setTimeout(() => {
        this.loadNextPage();
        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }

}