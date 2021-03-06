import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  items = [
      {icon: 'home', label: 'Home', routerLink: 'main'},
      {icon: 'cloud_upload', label: 'Upload', routerLink: 'upload'},
      {icon: 'photo_library', label: 'Collections', routerLink: 'collections'}
    ];

}
