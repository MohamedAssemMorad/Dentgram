import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, NavParams, Platform, Events, LoadingController } from 'ionic-angular';




//////////////////////////////////////////
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
// import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AccountfPage } from "../../pages/accountf/accountf";
//////////////////////////////////////////

import { DataProvider } from "../../providers/data/data";
import { SearchResultPage } from "../../pages/search-result/search-result";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
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
        style({ transform: 'translateX(200%)' }),
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
      state('cartBadge', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(500, keyframes([
          style({ opacity: 1, transform: 'translateX(100%)', offset: 0.1 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 0.5 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 0.7 }),
          style({ opacity: 1, transform: 'translateX(15px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class SearchPage {

  type = '';
  direc: any;
  direcR: any;
  isSearchToggle: boolean = false;
  cartBadgeState: string = 'idle';
  isPassReqister = false;
  searchQuery: string = '';
  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  histSearchWords: any[];
  thumb: string;
  filterOptions: string[] = [];
  showFilter: boolean = false;
  filterBy: string;
  city_list = [];
  city_list_ar = [];
  city_list_en = [];
  loader: any;
  allData = [];

  constructor(public navCtrl: NavController,
    public mainFunc: MainFunctionsProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public dataService: DataProvider,
    public loadingController: LoadingController,
    private http: Http,) {

    events.subscribe('application:isLogged', (token) => {
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
    });

    this.searchControl = new FormControl();
    this.type = this.navParams.get('type');

    if (this.type == 'for_catalogue') {
      this.type = 'product';
    } else if (this.type == 'job') {
      this.type = 'career';
    } else if (this.type == 'for_store') {
      this.type = 'item';
    } else if (this.type == 'for_used') {
      this.type = 'used_item';
    }

    this.callHistorysearches();
  }

  getCities (){
        let url = this.mainFunc.url + '/api/auth/register';
        this.showLoading('', true);
        let localdata_content = this.http.get(url).map(res => res.json().countries);
        
        localdata_content.subscribe(data => {
          if (data.length > 0){
            this.dismissLoading();
          }

          this.allData = data;

          let id;
        for (let index = 0; index < this.allData.length; index++) {
          const element = this.allData[index];
          if (element.name_en === 'Egypt') {
            id = index;
            break;
          }
        }

        this.city_list = this.allData[id].cities;
        });

        

        
  }

  showLoading(message: string, state: boolean){
      
    this.loader = this.loadingController.create({
      content: message
    });  
  
    if(!state){
      this.dismissLoading(); 
    }else{
      this.loader.present();
    }
    
  }

  dismissLoading(){
    setTimeout(() => {
      this.loader.dismiss();
    }, 50);
  }

  callHistorysearches() {
    this.histSearchWords = [];
    this.storage.get('hist_' + this.type).then((val) => {
      if (val != null) {
        this.histSearchWords = val;
      }
    });
  }

  ionViewWillEnter() {
    this.callHistorysearches();
    this.prepareFilter();
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";
    }

    this.searchControl.valueChanges.debounceTime(500).subscribe(search => {
      if (this.searchTerm.length > 1) {
        this.setFilteredItems();
      }
    });
  }

  prepareFilter() {
    let prevPageName = this.navCtrl.getPrevious().name;
    let prevSecretId = this.navCtrl.getPrevious().data.secretid;
    if (prevPageName.indexOf("Courses") > -1) {
      if (prevSecretId.indexOf("course") > -1) {
        this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER", "DATE_FILTER", "COURSE_PROVIDER_FILTER"];
        this.showFilter = true;
      } else if (prevSecretId.indexOf("event") > -1) {
        this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER", "DATE_FILTER"];
        this.showFilter = true;
      } else if (prevSecretId.indexOf("librar") > -1) {
        this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER", "DATE_FILTER"];
        this.showFilter = true;
      }
    } else if (prevPageName.indexOf("UsedAds") > -1) {
      this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER"];
      this.showFilter = true;
    }
  }

  onFilterByChange(selectedValue: any) {
    if(selectedValue === 'LOCATION_FILTER')
      this.getCities();

    this.setFilteredItems();
  }

  dismissview() {
    this.viewCtrl.dismiss();
  }

  setFilteredItems() {
    this.items = [];

    this.storage.get('city_id').then(city_id => {
      let datarecived;

      if(this.filterBy){
        datarecived = this.dataService.filterItemsBy(this.searchTerm, this.type, city_id, this.filterBy);
      }else{
        datarecived = this.dataService.filterItems(this.searchTerm, this.type, city_id);
      }
      
      datarecived.subscribe(data => {
        this.items = data;
        this.searching = false;
      });
    });
  }

  onSearchInput() {
    this.items = [];
    if (this.searchTerm.length > 1) {
      this.searching = true;
    }
  }

  openSearchResultPage() {
    this.navCtrl.push(SearchResultPage, {
      'type': this.type,
      'query': this.searchTerm,
      'filterBy': this.filterBy
    });
  }

  openSearchResultPageSpacefic(name) {
    this.navCtrl.push(SearchResultPage, {
      'type': this.type,
      'query': name
    });
  }

  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select': '1'
    });
  }

  showDeleteHistoryConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Delete History',
      message: 'Do you want to delete search history?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.storage.remove('hist_' + this.type);
            this.callHistorysearches();
          }
        }
      ]
    });
    confirm.present();
  }
}
