import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Storage } from '@ionic/storage';


/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataProvider {

  items: any;

  constructor(public http: Http, public mainFunc: MainFunctionsProvider,
    public storage: Storage) {
    console.log('Hello DataProvider Provider');
  }



  filterItems(searchTerm,Type,city_id){
    
    this.items = [];
    
        let Url_request = this.mainFunc.url + "/api/search?query=" + searchTerm + '&type=' + Type + '&limit=10&city_id=' + city_id ;
        console.log(Url_request);
        return this.http.get(Url_request).map(res => res.json());  
      // });
  }
  
}
