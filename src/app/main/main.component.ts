import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  imageList = [];
  tempCollection = 'Select a Collection';
  tempImageSelected: any;
  collections = [];
  defImage = "/assets/loading.gif"

  constructor(
    private service: ImageService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.imageList = this.service.getLatestImageList();
    if(this.service.getLatestImageList().length == 0){
      this.loadImages();
    } else {
      this.imageList = this.service.getLatestImageList();
    }
    this.service.getCollections().subscribe(data => {
      data.forEach(element => {
        this.collections.push(element.payload.doc.data());
      });
    });

    }

    collectionSelected(collection){
      this.tempCollection = collection;
    }

    addCollection(){
      if (this.tempCollection != 'Select a Collection'){
        this.service.addCollection(this.tempImageSelected.id, this.tempCollection, (newCollections) => {
          this.tempImageSelected.collections = newCollections;
          this.tempCollection = 'Select a Collection';
          this.tempImageSelected = null;
        });
      }
    }

    open(content, imageSelected) {
      this.tempImageSelected = imageSelected;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

      }, (reason) => {

      });
    }

    loadImages(){
      var getImages = this.service.getImages().subscribe(data => {
        data.forEach(a => {
          let item:any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          this.imageList.push(item);
        });
        var lastImageRef = data[data.length-1].payload.doc;
        this.service.lastImageKey = lastImageRef;
        this.service.setLatestImageList(this.imageList);
        getImages.unsubscribe();
      });
    }

    getNextImages(){
      var subscribeNextImages = this.service.getNextImages().subscribe(data => {
        if(data.length > 1){
        data.forEach(a => {
          let item:any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          this.imageList.push(item);
        });
        var lastImageRef = data[data.length-1].payload.doc;
        this.service.lastImageKey = lastImageRef;
        this.service.setLatestImageList(this.imageList);
        subscribeNextImages.unsubscribe();
       }
      })
    }

  addComment(imageKey){
    this.service.setSelectedImage(imageKey);
    this.router.navigate(['comments']);
  }

}
