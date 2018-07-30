import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  direc: any;
  direcR: any;
  storelist: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public storage: Storage, 
      private http: Http) {
      this.storelist = [];
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


    // Load Stores Data
    let localItemsdata = this.http.get('assets/storelist.json').map(res => res.json().items);
    localItemsdata.subscribe(data => {
      this.storelist = data;
      console.log('List = ' + data);

    });

  }

}