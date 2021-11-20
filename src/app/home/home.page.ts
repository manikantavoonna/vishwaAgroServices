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
  private url: string = "https://api.sheetson.com/v2/sheets";
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
    "X-Spreadsheet-Id": "1G4O0nqZ06p563UjjnA4p2obUfNAyPI93YK_3BVqO7js",
    "Authorization": "Bearer " + "rmD-z-eJ3ZlDGKWhG1ZsigLgNCZnP6vC5LjlPkbZkvfD7NgeB3Q2SslMfUg"
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

  public submitForm(body) {

    body = {
      startTime: this.datePipe.transform(this.startTime, 'd-MMM-yy, h:mm:ss a'),
      fieldTime: this.fieldTime,
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
      remarks: this.remarks,
    };

    this._loadingCtrl.create({
      message: 'Submitting data...please wait..'
    }).then((response) => { 
      response.present();
      this.postData(body).subscribe((res) => {
        console.log(res);
        this.dismissLoader();
        this.submitted = true;
      },
        (err) => {
          console.log(err);
        })
    })
  }

  public postData(body) {
    return this._http.post(`https://api.sheetson.com/v2/sheets/vishwaAgro`, body, { headers: this.headers });
  }

  public getData() {
    return this._http.get(`https://api.sheetson.com/v2/sheets/vishwaAgro`, { headers: this.headers })
  }

  public fetchData() {
    this.getData().subscribe((res: any) => {
      console.log(res);
      this.lastRecord = res.results[res.results.length - 1];
    })
  }

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
}