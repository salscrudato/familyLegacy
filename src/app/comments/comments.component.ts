import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  commentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required)
  });

  image:any;
  imageRef:any;
  commentArr = [];

  constructor(private service: ImageService) { }

  ngOnInit(): void{

    this.loadImage();

  }

  submitComment(comment){
    this.service.addComment(this.image.id, comment, () => {
      this.commentForm.reset();
      this.loadImage();
    });

  }

  loadImage(){

    const imgKey = this.service.getSelectedImage();
    this.service.getImage(imgKey).subscribe(data =>{
      this.imageRef = data;
      console.log('ID: ' + data.id);
      this.image = data.data();
      this.image.id = data.id;
      console.log('Comments: ' + this.image.comments);

    });

  }

}
