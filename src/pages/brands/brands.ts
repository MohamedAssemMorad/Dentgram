import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { BrandsStoresPage } from "../brands-stores/brands-stores";


@Component({
  selector: 'page-brands',
  templateUrl: 'brands.html',
})
export class BrandsPage {
  direc: any;
  direcR: any;
  storelist: any[];
  storelistalldata: any[];
  records: number;
  hasMoreitems = false;

  isDataAvilable = false;
  current_page: number;
  can_load_more: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public storage: Storage, 
      private http: Http) {
      this.storelist = [];
      this.storelistalldata = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsPage');

    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }


    let url = this.mainFunc.url + '/api/structure/brands'
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      console.log('Remote Brands = ' + dataall);
      let data = dataall.brands;
      this.storelistalldata = data;
      this.records = data.length;
      let end_point = 20;
      if (data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
      }else{
        this.isDataAvilable = false;
      }
      this.storelist = data;
    });

  }

  loadNextPage() {
    let url = this.mainFunc.url + '/api/structure/brands' + '?page=' + (this.current_page + 1);
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      // console.log('Remote Brands = ' + dataall);
      let data = dataall.brands;

      // this.storelistalldata = data;
      this.records = data.length;
      let end_point = 20;
      if (data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
      }else{
        this.isDataAvilable = false;
      }

      for (let index = 0; index < data.length; index++) {
        let e = data[index];
        this.storelist.push(e);
      }
    });
  }
  // doInfinite(): Promise<any> {
  //   console.log('Begin async operation');

  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       // for (var i = 0; i < 30; i++) {
  //       //   // this.items.push( this.items.length );
  //       // }

  //       let currentlength = this.storelist.length;
  //       let alllenght = this.storelistalldata.length; 
  //       this.records = alllenght - currentlength;
        
  //       let end_point = 0;
        
  //       if (this.records > 20){
  //         end_point = 20 + currentlength;
  //         this.hasMoreitems = true;
  //       }else{
  //         end_point = this.records + currentlength;
  //         this.hasMoreitems = false;
  //       }

  //       for (let index = currentlength; index < end_point; index++) {
  //         const e = this.storelistalldata[index];
  //         this.storelist.push(e);
  //       };

      
  //       console.log('Async operation has ended');
  //       resolve();
  //     }, 1000);
  //   })
  // }

  doInfinite(infiniteScroll) {
    if(this.can_load_more){
      // console.log('Begin async operation');
      setTimeout(() => {
        this.loadNextPage();
        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }

  openBrandStores(id,name) {
    this.navCtrl.push(BrandsStoresPage, {
      'id' : id,
      'name' : name
    });   
  }
}