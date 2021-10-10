import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  private url: string = "https://api.sheetson.com/v2/sheets";
  private headers: HttpHeaders = new HttpHeaders({
    "X-Spreadsheet-Id": "1G4O0nqZ06p563UjjnA4p2obUfNAyPI93YK_3BVqO7js",
    "Authorization": "Bearer " + "rmD-z-eJ3ZlDGKWhG1ZsigLgNCZnP6vC5LjlPkbZkvfD7NgeB3Q2SslMfUg"
  });

  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address: string;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private _http: HttpClient
  ) { }

  // geolocation options
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  public submitForm(body) {
    // const scriptURL = 'https://script.google.com/macros/s/AKfycby7KcSG4qN2AxEpFqHYjiKKmdLAb3rJTt5BgHSjwkzqXa3s6Cn0DMP-Rsb4xqW2GyXP/exec'
    // return this._http.post(scriptURL, body);

    body = {
      timestamp: new Date(),
      latitude: this.latitude,
      longitude: this.longitude,
      tracking: 'tracking',
    };
    return this._http.post(`https://api.sheetson.com/v2/sheets/vishwaAgro`, body, { headers: this.headers }).toPromise();
  }
  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.submitForm({});
      this.getAddress(this.latitude, this.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
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
        alert('Error getting location' + JSON.stringify(error));
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
}