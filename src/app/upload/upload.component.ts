import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// ----- Angular Fire 2 Imports -----
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { ImageService } from 'src/app/shared/image.service';
import { finalize } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required)
  });
  imgSrc: string = '/assets/click-to-upload.jpg';
  selectedImage: any = null;
  isSubmitted: boolean;

  collections = [];
  tempCollection = 'Select a Collection';
  collectionList = [];

  constructor(private storage: AngularFireStorage, private service: ImageService,
  private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.service.getImageDetailList();
    this.service.getCollections().subscribe(data => {
      data.forEach(element => {
        this.collections.push(element.payload.doc.data());
      });
    });
    this.resetForm();
  }

  addCollection(){
    if(this.tempCollection != 'Select a Collection'){
      this.collectionList.push(this.tempCollection);
      this.tempCollection = 'Select a Collection';
    }
  }

  collectionSelected(col){
    this.tempCollection = col;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

    }, (reason) => {

    });
  }

  onSubmit(formValue){

    if(formValue.imageUrl == null){
      this.showSnackBar('Select Image', 'X', 3000);
    } else {

      this.spinner.show();

      //Create Reference to Image - It's the imageName + dateTime
      const imageName = this.selectedImage.name.split('.').slice(0, -1);
      const dateTime = new Date().getTime();
      var filePath = imageName + '_' + dateTime;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            formValue['uploadedTime'] = dateTime;
            formValue['comments'] = [{}];
            if(this.collectionList.length > 0){
              formValue['collections'] = this.collectionList;
            }
            // this.service.insertImageDetails(formValue);
            this.service.uploadImage(formValue);
            this.resetForm();
            this.spinner.hide();
            this.showSnackBar('Image Uploaded!', 'X', 5000);
          })
        })
      ).subscribe();

    }

      // this.spinner.show();
      //
      // //Create Reference to Image - It's the imageName + dateTime
      // const imageName = this.selectedImage.name.split('.').slice(0, -1);
      // const dateTime = new Date().getTime();
      // var filePath = imageName + '_' + dateTime;
      // const fileRef = this.storage.ref(filePath);
      // this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      //   finalize(() => {
      //     fileRef.getDownloadURL().subscribe((url) => {
      //       formValue['imageUrl'] = url;
      //       formValue['uploadedTime'] = dateTime;
      //       formValue['comments'] = [{}];
      //       if(this.collectionList.length > 0){
      //         formValue['collections'] = this.collectionList;
      //       }
      //       // this.service.insertImageDetails(formValue);
      //       this.service.uploadImage(formValue);
      //       this.resetForm();
      //       this.spinner.hide();
      //       this.showSnackBar('Image Uploaded!', 'X', 5000);
      //     })
      //   })
      // ).subscribe();
  }

  showPreview(e : any){
    if(e.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e : any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(e.target.files[0]);
      this.selectedImage = e.target.files[0];
    } else {
      this.imgSrc = '/assets/click-to-upload.jpg';
      this.selectedImage = null;
    }
  }

  resetForm(){
    this.formTemplate.reset();
    this.imgSrc = '/assets/click-to-upload.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
    this.collectionList = [];
  }

  showSnackBar(msg1, msg2, duration){
    this.snackBar.open(msg1, msg2, {
      duration: duration
    });
  }

}
