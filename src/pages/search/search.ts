import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, NavParams, Platform } from 'ionic-angular';

//////////////////////////////////////////
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounceTime';
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

  constructor(public navCtrl: NavController,
    public mainFunc: MainFunctionsProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    public storage: Storage,
    public alertCtrl: AlertController,
       public navParams: NavParams,
        public dataService: DataProvider) {

        this.searchControl = new FormControl();
        this.type = this.navParams.get('type');
        
        if(this.type == 'for_catalogue'){
          this.type = 'product';
        }else if(this.type == 'job'){
          this.type = 'career';
        }else if(this.type == 'for_store'){
          this.type = 'item';
        }else if(this.type == 'for_used'){
          this.type = 'used_item';
        }

        
        // console.log('Hist List Items = ' + this.histSearchWords);
        this.callHistorysearches();

  }

  callHistorysearches() {

    this.histSearchWords = [];
      this.storage.get('hist_' + this.type).then((val) =>{
        if (val != null){
          this.histSearchWords = val; 
        }else{
        }
      });
  }

  ionViewWillEnter(){ 
    this.callHistorysearches();
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
 
      if(this.searchTerm.length > 1){
        
        this.setFilteredItems();
      }
      
    });

    
  }

  dismissview(){
    this.viewCtrl.dismiss();
  }

  setFilteredItems() {
    this.items = [];
    
    this.storage.get('city_id').then(city_id => {

      let datarecived = this.dataService.filterItems(this.searchTerm,this.type,city_id);

      datarecived.subscribe(data => {
              this.items = data;
              this.searching = false;
              console.log('Search : ' + this.items);
            });
          });
  }

  onSearchInput(){
    this.items = [];
    if(this.searchTerm.length > 1){
      this.searching = true;
    }
  }

  openSearchResultPage(){
    this.navCtrl.push(SearchResultPage, {
      'type' : this.type,
      'query': this.searchTerm
    });
  }

  openSearchResultPageSpacefic(name){
    this.navCtrl.push(SearchResultPage, {
      'type' : this.type,
      'query': name
    });
  }

  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
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
