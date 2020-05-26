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

  constructor(private service: ImageService,
    private router: Router) { }

  ngOnInit(): void {

    //Move this to separate function and unsubscribe
    this.service.getCollections().subscribe(data => {
      data.forEach(element => {
        this.collections.push(element.payload.doc.data());
      });
    });


  }

  setCollection(col) {
    this.selectedCollection = col.collectionName;
    //Move this to separate function and unsubscribe
    this.service.getImagesByCollection(col).subscribe(data => {
      this.updateImageList(data);
    });
  }

  updateImageList(data) {
    var unsortedImages = []
    this.images = [];
    data.forEach(element => {
      let tmpItem: any = element.payload.doc.data();
      tmpItem.id = element.payload.doc.id;
      // this.images.push(tmpItem);
      unsortedImages.push(tmpItem);
    });

    var tmpImage: any;
    // const n = this.images.length
    const n = unsortedImages.length
    if (n > 1) {
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (unsortedImages[j].uploadedTime < unsortedImages[j + 1].uploadedTime) {
            tmpImage = unsortedImages[j];
            unsortedImages[j] = unsortedImages[j + 1];
            unsortedImages[j + 1] = tmpImage;
          }
        }
      }
    }
    this.images = unsortedImages;
  }

  addComment(imageKey) {
    this.service.setSelectedImage(imageKey);
    this.router.navigate(['comments']);
  }

}
