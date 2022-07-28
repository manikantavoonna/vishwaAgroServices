import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DatePipe } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  private url: string = "https://script.google.com/macros/s/AKfycbyLrnAD3vl4bZdwcmTE0Q3A18dqA7FFwwqMYHwhaqwdmVJNJsDXdEjQWGE6jR261zn3/exec";
  public lastRecord = {};
  public startTime: any = '';
  public fieldTime: any = '';
  public name = '';
  public mobile = '';
  public cropType = '';
  public landArea = '';
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address = '';
  pestQty = '';
  feedback = '';
  remarks = '';
  submitted = false;
  public beforeSpray: any = '';
  public afterSpray: any = '';
  private headers: HttpHeaders = new HttpHeaders({

  });


  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private _http: HttpClient,
    private datePipe: DatePipe,
    private _loadingCtrl: LoadingController,
    private locationAccuracy: LocationAccuracy
  ) { }

  // geolocation options
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  public submitForm() {

    //body = {
     // data.append("startDateTime" ,this.datePipe.transform(this.startTime, 'd-MMM-yy, h:mm:ss a'))
    /*  fieldTime: this.fieldTime,
      name: this.name,
      mobile: this.mobile,
      cropType: this.cropType,
      landArea: this.landArea,
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
      pestQty: this.pestQty,
      beforeSpray: this.beforeSpray,
      afterSpray: this.afterSpray,
      feedback: this.feedback,
      remarks: this.remarks,*/
    //};

  var data = new FormData();
   data.append( "Name" ,this.name);
   data.append( "Mobile" ,this.mobile);
   data.append( "fieldTime" ,this.datePipe.transform(this.fieldTime, 'd-MMM-yy, h:mm:ss a'));
   data.append( "cropType" ,this.cropType,);
   data.append( "landArea" ,this.landArea);
   data.append( "latitude" ,this.latitude);
   data.append( "longitude" ,this.longitude);
   data.append( "StartDateTime" ,this.datePipe.transform(this.startTime, 'd-MMM-yy, h:mm:ss a'));
   data.append( "pestQty" ,this.pestQty);
   data.append( "beforeSpray" ,this.datePipe.transform(this.beforeSpray, 'd-MMM-yy, h:mm:ss a'));
   data.append( "afterSpray" ,this.datePipe.transform(this.afterSpray, 'd-MMM-yy, h:mm:ss a'));
   data.append( "feedback" ,this.feedback);
   data.append( "remarks" ,this.remarks);

   // console.log(data);  
    
      var requestOptions = {
        method: 'POST',
        body: data,
        headers: {
          //'Content-Type': 'application/json'
          //'Content-Type': 'application/x-www-form-urlencoded'
        }
        //redirect: 'follow'
      };
    console.log(data);

  //var entrdata = 'https://script.google.com/macros/s/AKfycbztQb9RPA4xvWsqRyitKUwASv7VG5n72mG10FZf3sCwP0DECXRoY9aWRQ-VAgO29WU3/exec?'+JSON.stringify(body);

  fetch('https://script.google.com/macros/s/AKfycbwAUp9QOjHp71WZgLhr1D_PgqdmpvprYhjQWqvaxe5Vu2wwRFYgSB2cJM6v8_JdiPKS/exec', requestOptions)
  //.then(response => response.text())
  .then(function(res){ return res.json(); })
  .then(function(data){ alert( JSON.stringify( data ) ) })
  //.then(result => console.log(result))

 // .catch(error => console.log('error', error));

      //postData('https://script.google.com/macros/s/AKfycbztQb9RPA4xvWsqRyitKUwASv7VG5n72mG10FZf3sCwP0DECXRoY9aWRQ-VAgO29WU3/exec', requestOptions)
    
    /*  .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      })*/
      console.log(data);  
  }

 

 /* public postData(body) {
    return this._http.post(`https://script.google.com/macros/s/AKfycby9oXFWKKm93vFSBLBlz0MlphCSqGRVgdxpRUdPqZSBdbbOKmo5Dhv6qCVbaJymni2q/exec`, body, { headers: this.headers });
  }

  public getData() {
    return this._http.get(`https://script.google.com/macros/s/AKfycby9oXFWKKm93vFSBLBlz0MlphCSqGRVgdxpRUdPqZSBdbbOKmo5Dhv6qCVbaJymni2q/exec`, { headers: this.headers })
  }

  public fetchData() {
    this.getData().subscribe((res: any) => {
      console.log(res);
      this.lastRecord = res.results[res.results.length - 1];
    })
  }*/

  dismissLoader() {
    this._loadingCtrl.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch((err) => {
      console.log('Error occured : ', err);
    });
  }

  getLatLong() {
    this.getCurrentCoordinates();
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.getCurrentCoordinates();
            console.log('Request successful')
          },
          error => console.log('Error requesting location permissions', error)
        );
      } else {
        this.getCurrentCoordinates();
      }
    });
  }
  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    // this.simpleLoader('Fetching cordinates...');
    this._loadingCtrl.create({
      message: 'Fetching cordinates...'
    }).then((response) => {
      response.present();
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp);
        this.dismissLoader();
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        // this.submitForm({});
        // this.fetchData();
        this.getAddr();
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  getAddr() {
    this.getGeoFromAddr().subscribe((res:any) => {
      const addr = res.results[0].locations[0];
      this.address = `${addr.adminArea1}, ${addr.adminArea3}, ${addr.adminArea4}, ${addr.adminArea5}, ${addr.adminArea6}, ${addr.street}, ${addr.postalCode}`
      console.log(res.results[0]);
    })
  }
  getGeoFromAddr(){
    return this._http.get(`http://open.mapquestapi.com/geocoding/v1/reverse?key=QTiuKR2rjSn4oZGuNWGoQQvg9Acha8XZ&location=${this.latitude},${this.longitude}8&includeRoadMetadata=true&includeNearestIntersection=true`);
  }

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  // get address using coordinates
  getAddress(lat, long) {
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
      .then((res: NativeGeocoderResult[]) => {
        this.address = this.pretifyAddress(res[0]);
      })
      .catch((error: any) => {
        console.log('Error getting location' + JSON.stringify(error));
      });
  }

  // address
  pretifyAddress(address) {
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        data += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

  public getTime(key) {
    this[key] = new Date();
  }

  public reset() {
    this.startTime = '';
    this.fieldTime = '';
    this.name = '';
    this.mobile = '';
    this.cropType = '';
    this.landArea = '';
    this.latitude = '';
    this.longitude = '';
    this.address = '';
    this.pestQty = '';
    this.beforeSpray = '';
    this.afterSpray = '';
    this.feedback = '';
    this.remarks = '';
    this.submitted = false;
  }

/*
// Example POST method implementation:
async function postData(url = '', data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //mode: 'no-cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      //'Content-Type': 'application/json'
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    //redirect: 'follow', // manual, *follow, error
   // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
   body: JSON.stringify(data) // body data type must match "Content-Type" header

  });
  console.log(data)
  console.log(JSON.stringify(data))
  //return response.json(); // parses JSON response into native JavaScript objects
}
*/
/*postData(url = '', requestOptions) {

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}*/
}