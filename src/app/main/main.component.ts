import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  imageList = [];

  constructor(
    private service: ImageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadImages();
    }

    loadImages(){
      this.service.getImages().subscribe(data => {
        data.forEach(a => {
          let item:any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          this.imageList.push(item);
        });
         var lastImageRef = data[data.length-1].payload.doc;
        this.service.lastImageKey = lastImageRef;
      });
    }

    getNextImages(){
      this.service.getNextImages().subscribe(data => {
        console.log('Second Call');
        console.log(data.length);
        if(data.length > 1){
        data.forEach(a => {
          let item:any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          this.imageList.push(item);
        });
        var lastImageRef = data[data.length-1].payload.doc;
       this.service.lastImageKey = lastImageRef;
       }
      })
    }

  addComment(imageKey){
    this.service.setSelectedImage(imageKey);
    this.router.navigate(['comments']);
  }

}
