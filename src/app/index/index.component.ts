import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass', '../app.component.scss']
})
export class IndexComponent implements OnInit {

  map: any
  marker: any
  layerGroup: any
  radius: number
  circle: any
  res: any
  lat: any
  longi: any
  length = 0
  div_show = 1
  ap_tn: any
  pv_tn: any
  areashape: any
  url: any
  lat_lon_me: any
  lat_lon_locat: any

  constructor(private http: HttpClient,
    public router: Router) {
  }

  ngOnInit() {
    if (this.radius == undefined) {
      this.radius = 50000
    }

    this.map = L.map('map').on('click', (e) => {
      this.circle.clearLayers()
      this.layerGroup.clearLayers()
      var c = L.circle([e.latlng.lat, e.latlng.lng], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
        radius: this.radius
      }).addTo(this.circle);
      this.map.fitBounds(c.getBounds());

      this.http.get("http://nucoop.nu.ac.th/1_api_map/api_map_query_demo_1.php?type=search&lat="
        + e.latlng.lat + "&lon=" + e.latlng.lng + "&radius=" + this.radius)
        .subscribe(res => {
          this.res = res
          this.length = this.res.length
          for (var i = 0; i <= this.res.length; i++) {
            this.marker = L.marker([this.res[i].ap_lat, this.res[i].ap_lon])
              .bindPopup(this.res[i].ap_tn)
              .addTo(this.layerGroup)
          }
        })

    })
      .setView([13.761897, 100.692594], 6);

    this.circle = L.layerGroup().addTo(this.map);
    this.layerGroup = L.layerGroup().addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map by <a href="http://www.cgistln.nu.ac.th/" target="_blank">GISTNU</a> '
    }).addTo(this.map)


    this.map.locate({ setView: false, maxZoom: 18 })
      .on('locationfound', (e) => {
      })
  }


  locate() {
    this.layerGroup.clearLayers()
    this.map.locate({ setView: true, maxZoom: 18 })
      .on('locationfound', (e) => {
        this.circle.clearLayers()
        this.layerGroup.clearLayers()
        this.marker = L.marker([e.latitude, e.longitude])
          .bindPopup('ตำแหน่งปัจจุบันของท่าน')
          .addTo(this.layerGroup)
        var c = L.circle([e.latlng.lat, e.latlng.lng], {
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.1,
          radius: this.radius
        }).addTo(this.circle);
        this.map.fitBounds(c.getBounds());

        this.http.get("http://nucoop.nu.ac.th/1_api_map/api_map_query_demo_1.php?type=search&lat="
          + e.latlng.lat + "&lon=" + e.latlng.lng + "&radius=" + this.radius)
          .subscribe(res => {
            this.res = res

            this.length = this.res.length
            for (var i = 0; i <= this.res.length; i++) {
              this.marker = L.marker([this.res[i].ap_lat, this.res[i].ap_lon])
                .bindPopup(this.res[i].ap_tn)
                .addTo(this.layerGroup)
            }
          })
      })



  }


  company() {
    this.http.get("http://nucoop.nu.ac.th/1_api_map/api_map_query_demo_1.php?type=search")
      .subscribe(res => {
      })
  }

  show_detail(item) {
    this.div_show = 2
    this.ap_tn = item.ap_tn;
    this.pv_tn = item.pv_tn;
    this.areashape = item.areashape;
    this.lat = item.ap_lat
    this.longi = item.ap_lon
    this.lat_lon_locat = this.lat + "," + this.longi
    this.lat_lon_me = '13.734821, 100.581670'


  }

  close_detail() {
    this.div_show = 1
  }

}
