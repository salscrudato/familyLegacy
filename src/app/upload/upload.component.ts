import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// ----- Angular Fire 2 Imports -----
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { ImageService } from 'src/app/shared/image.service';
import { finalize } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";

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

  constructor(private storage: AngularFireStorage, private service: ImageService,
  private snackBar: MatSnackBar, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.service.getImageDetailList();
    this.resetForm();
  }

  onSubmit(formValue){
    this.spinner.show();
    console.log(this.formTemplate);
      //Create Reference to Image - It's the imageName + dateTime
      const imageName = this.selectedImage.name.split('.').slice(0, -1);
      const dateTime = new Date().getTime();
      var filePath = imageName + '_' + dateTime;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            console.log('Upload Finished and Picture Stored at ' + url);
            formValue['imageUrl'] = url;
            formValue['uploadedTime'] = dateTime;
            formValue['comments'] = [{}];
            // this.service.insertImageDetails(formValue);
            this.service.uploadImage(formValue);
            this.resetForm();
            this.spinner.hide();
            this.showSnackBar('Image Uploaded!', 'X', 5000);
          })
        })
      ).subscribe();
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
  }

  showSnackBar(msg1, msg2, duration){
    this.snackBar.open(msg1, msg2, {
      duration: duration
    });
  }

}
