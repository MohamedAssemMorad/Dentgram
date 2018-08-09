import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events } from 'ionic-angular';



import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { Storage } from '@ionic/storage';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ItemDetailsPage } from "../../pages/item-details/item-details";

import { TranslateService } from '@ngx-translate/core';

import { AccountfPage } from "../../pages/accountf/accountf";
import { BuyBrowseProductsPage } from "../buy-browse-products/buy-browse-products";

import { SearchPage } from "../../pages/search/search";

@Component({
  selector: 'page-buy-categories-sub',
  templateUrl: 'buy-categories-sub.html',
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

export class BuyCategoriesSubPage {

  slider_Data_Store: any[];
  bestOvers: any[];
  bestSell: any[];
  bestrecommended: any[];
  searchResults: any[];
  number_of_sliders: any;
  subscription;
  isSearchToggle: boolean = false;
  cartBadgeState: string = 'idle';
  direc: any;
  direcR: any;
  storelist: any[];
  homemenu: any[];
  catName: string;
  catId: string;
  secretid = 'product';
  thumb: string;

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController, 
        private changeDetector: ChangeDetectorRef,
          public platform: Platform,
            public translate: TranslateService,
              public events: Events,
                public storage: Storage,
                public navParams: NavParams) {

                this.storelist = [];
                this.homemenu = [];
                this.slider_Data_Store = [];

                this.catName = this.navParams.get('name');
                this.catId = this.navParams.get('id');
                this.events.publish('application:language','');
                this.viewCtrl.setBackButtonText('');

                events.subscribe('application:isLogged', (token) => {
      
                  this.storage.get('thumb').then((val) => {
                    this.thumb = val;
                  });
                  
                });
  }

  ionViewDidEnter(){
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
  }  
    ionViewDidLoad(){
      this.viewCtrl.setBackButtonText('');
      // this.direc = !this.platform.dir();
        // this.platform.dir.toString
      // let localdata_slider = this.http.get('assets/slider.json').map(res => res.json().items);
      // localdata_slider.subscribe(data => {
      //   this.slider_Data_Store = data;
      //   this.number_of_sliders = data.length;
      // });
  
      let localBestOverdata = this.http.get('assets/bestover.json').map(res => res.json().items);
      localBestOverdata.subscribe(data => {
        this.bestOvers = data;
      });
  
      let localBestSelldata = this.http.get('assets/bestsell.json').map(res => res.json().items);
      localBestSelldata.subscribe(data => {
        this.bestSell = data;
      });
  
      let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
      localBestRecommendeddata.subscribe(data => {
        this.bestrecommended = data;
      });
      
      // Load Main Home Page Menu Data
      let localHomeMenudata = this.http.get('assets/cataloguesublist.json').map(res => res.json());
      localHomeMenudata.subscribe(data => {
        console.log('Catalogue = ' + data);
        this.homemenu = data.categories;
        // let slider_data = data.slider;
        // this.slider_Data_Store = slider_data;
        // this.number_of_sliders = slider_data.length;

      });
      // Load Stores Data
      let localItemsdata = this.http.get('assets/beststores.json').map(res => res.json().items);
      localItemsdata.subscribe(data => {
        this.storelist = data;
        console.log('List = ' + data);
        if(data.slides){
          this.slider_Data_Store = data.slides;
        }
      });
  
      // Home Page Slider Timer Controller
      this.subscription = Observable.interval(3000).subscribe(x=> {
        
        try {
          this.slides.slideNext(1000);
        } catch (error) {
          
        }
      });
    }
  
    click_Open_catalogue_sub_id(id,name_ar,name_en){
      let name = '';
      if (this.platform.dir() === "rtl") {
        name = name_ar;
      } else {
        name = name_en;
      }
      this.navCtrl.push(BuyBrowseProductsPage, {
        'id' : id,
        'name' : name
      });  
    }

    showSearchBar() {
      this.navCtrl.push(SearchPage, {
        'type' : this.secretid
      });
    }

    addToCart(id,item){
      console.log('add id = '+ id + ' & item = ' + item);
      this.mainFunc.addToCart(id);
      // this.mainFunc.cartItems.push(id);
      // this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
      item.addButtonState = 'adding';
      this.cartBadgeState = 'adding';
      this.changeDetector.detectChanges();
      // this.mainFunc.checkItemInCart(id);
    }
    addToCartFinished(item){
      this.cartBadgeState = 'idle';
      item.addButtonState = 'idle';
    }
    addToFav(item){
      this.mainFunc.addToFav(item);
    }
    removeFromFav(item){
  
    }
    
    openItemDetails(id) {
      this.navCtrl.push(ItemDetailsPage);
    }
    searchBar(word) {
      
    }
  
    openCartPage() {
      this.navCtrl.push(AccountfPage, {
        'select' : '1'
      });   
    }
  
    openCartPage2() {
      this.navCtrl.push(AccountfPage, {
        'select' : '1'
      });   
    }
  
    dismissview(){
      this.viewCtrl.dismiss();
    }

    
  }

