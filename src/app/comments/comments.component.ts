import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from "rxjs/operators";
import { Location } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  commentForm = new FormGroup({
    name: new FormControl(''),
    comment: new FormControl('', Validators.required)
  });

  image:any;
  imageRef:any;
  commentArr = [];

  constructor(private service: ImageService,
              private _location: Location) { }

  ngOnInit(): void{

    this.loadImage();

  }

  submitComment(comment){
    if(comment.name==''){
      comment.name = 'Anonymous';
    }
    this.service.addComment(this.image.id, comment, () => {
      this.commentForm.reset();
      this.loadImage();
    });
  }

  loadImage(){
    const imgKey = this.service.getSelectedImage();
    this.service.getImage(imgKey).subscribe(data =>{
      this.imageRef = data;
      this.image = data.data();
      this.image.id = data.id;
    });
  }

  goBack(){
    this._location.back();
  }

}
