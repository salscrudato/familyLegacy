import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collections = [];
  images = [];
  selectedCollection = 'Select a Collection';
  defImage = "/assets/loading.gif"

  constructor(private service:ImageService,
  private router:Router) { }

  ngOnInit(): void {

    //Move this to separate function and unsubscribe
    this.service.getCollections().subscribe(data => {
      data.forEach(element => {
        this.collections.push(element.payload.doc.data());
      });
    });


  }

  setCollection(col){
    this.selectedCollection = col.collectionName;
    //Move this to separate function and unsubscribe
    this.service.getImagesByCollection(col).subscribe(data => {
      this.updateImageList(data);
    });
  }

  updateImageList(data){
    this.images = [];
    data.forEach(element => {
      let tmpItem:any = element.payload.doc.data();
      tmpItem.id = element.payload.doc.id;
      this.images.push(tmpItem);
    });
  }

  addComment(imageKey){
    this.service.setSelectedImage(imageKey);
    this.router.navigate(['comments']);
  }

}
