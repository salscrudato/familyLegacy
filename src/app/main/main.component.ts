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

    this.reloadImages();

    }

    reloadImages(){
      this.imageList = [];
      this.service.getImages().subscribe(data => {
        data.forEach(a => {
          console.log('Reloading Images');
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
