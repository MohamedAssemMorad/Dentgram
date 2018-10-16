import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events, Content } from 'ionic-angular';



import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { ItemDetailsPage } from "../../pages/item-details/item-details";

import { TranslateService } from '@ngx-translate/core';

import { AccountfPage } from "../../pages/accountf/accountf";
import { CategorysPage } from "../../pages/categorys/categorys";
import { CoursesCategoriesPage } from "../courses-categories/courses-categories";
import { BooksCategoriesPage } from "../books-categories/books-categories";

import { CoursesDetailsPage } from "../../pages/courses-details/courses-details";

import { Storage } from '@ionic/storage';

import { SearchPage } from "../../pages/search/search";

import { LibraryDetailsPage } from "../../pages/library-details/library-details";

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

/**
 * Generated class for the AccContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-news',
  templateUrl: 'news-page.html',


})
export class NewsPage {
  
  isSearchToggle: boolean = false;
  direc: any;
  direcR: any;
  homemenu: any[];
  thumb: string;
  
  @ViewChild(Content)
  content:Content;

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController, 
        private changeDetector: ChangeDetectorRef,
          public platform: Platform,
            public translate: TranslateService,
            public storage: Storage,
              public events: Events,
              private youtube: YoutubeVideoPlayer,
                public navParams: NavParams) {

                  events.subscribe('application:isLogged', (token) => {
                  
                    this.storage.get('thumb').then((val) => {
                     
                      this.thumb = val;
                    });
                  });

                this.homemenu = ["ahmed","a","a","a","a","a"];
  }



  
  dismissview(){
    this.viewCtrl.dismiss();
  }
    

    showSearchBar() {
      
    }

   
  
    addToFav(item){
      // this.mainFunc.addToFav(item);
    }
    removeFromFav(item){
  
    }
    
    
  
    


    
  

}
