
import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
// ----- Angular Fire 2 -----
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageDetailList: AngularFireList<any>;
  commentImage: string;

  //New Service Fields
  lastImageKey: any;

  constructor(private firebase: AngularFireDatabase, private firestore: AngularFirestore) { }

  //Call this to populate imageDetailList
  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  uploadImage(image){
    this.firestore.collection('images').add(image);
  }

  addComment(imageId, comment, onComplete){
    let newComm = comment;
    this.firestore.collection('images').doc(imageId).get().subscribe(data => {
      let commArr = data.data().comments;
      commArr.push(comment);
      this.firestore.collection('images').doc(imageId).update({
      comments: commArr
      });
      onComplete();
    });

  }

  getImages(){
    return this.firestore.collection('images', ref => ref.orderBy('uploadedTime', 'desc')).snapshotChanges();
  }

  newGetImages(){
    return this.firestore.collection('images', ref => ref.orderBy('uploadedTime', 'desc').limit(10)).snapshotChanges();
  }

  getNextImages(){
    console.log('Last Image Ref: ' + this.lastImageKey);

    return this.firestore.collection("images", ref =>
          ref.orderBy("uploadedTime", "desc")
          .startAfter(this.lastImageKey)
          .limit(10)).snapshotChanges();
  }

  getImage(key){
    return this.firestore.collection('images').doc(key).get();
  }


  setSelectedImage(imageKey){
    this.commentImage = imageKey;
  }

  getSelectedImage(){
    return this.commentImage;
  }

  insertImageDetails(imageDetails) {
    this.imageDetailList.push(imageDetails);
    console.log('In Service, printing AngularFireList from insertImageDetails.');
    console.log(this.imageDetailList);
  }

}
