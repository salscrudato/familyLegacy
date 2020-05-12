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
  tempImageList = [];

  constructor(
    private service: ImageService,
    private router: Router
  ) { }

  ngOnInit() {

    //this.reloadImages();
    this.reloadImages2();
    }

    reloadImages2(){
      this.service.newGetImages().subscribe(data => {
        console.log('First Call');
        console.log(data[data.length-1].payload.doc.id);
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


    reloadImages(){
      this.imageList = [];
      this.service.getImages().subscribe(data => {
        data.forEach(a => {
          let item:any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          this.imageList.push(item);
        });
      }
    );
  }

  addComment(imageKey){
    this.service.setSelectedImage(imageKey);
    this.router.navigate(['comments']);
  }


    // this.service.getImageDetailList();
    // this.service.imageDetailList.snapshotChanges().subscribe(
    //   list => {
    //     this.imageList = list.map(item => {
    //       console.log(item.payload.key);
    //       return item.payload.val();
    //     });
    //   }
    // );


}
