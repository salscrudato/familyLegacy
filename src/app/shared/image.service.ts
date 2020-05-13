
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

  latestImageList = [];

  constructor(private firebase: AngularFireDatabase, private firestore: AngularFirestore) { }

  getCollections(){
    return this.firestore.collection('collections', ref =>
      ref.orderBy('collectionName'))
      .snapshotChanges();
  }

  getImagesByCollection(collection){
    return this.firestore.collection('images', ref =>
    ref.where("collections", "array-contains", collection.collectionName)).snapshotChanges();
  }

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

  addCollection(imageId, collection, onComplete){
    var colArray = [];
    var collectionExists = false;
    this.firestore.collection('images').doc(imageId).get().subscribe(data => {
      if(data.data().collections==null){
        colArray[0] = collection;
      } else {
        colArray = data.data().collections;
        colArray.forEach(a => {
          if(a == collection){
            collectionExists = true;
          }
        });
        if (collectionExists==false){
          colArray.push(collection);
        }
      }

      if(collectionExists==false){
        this.firestore.collection('images').doc(imageId).update({
          collections: colArray
        });
      }
      onComplete(colArray);
    });

  }

  // getImages(){
  //   return this.firestore.collection('images', ref => ref.orderBy('uploadedTime', 'desc')).snapshotChanges();
  // }

  getImages(){
    return this.firestore.collection('images', ref =>
      ref.orderBy('uploadedTime', 'desc')
      .limit(10))
      .snapshotChanges();
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
  }

  setLatestImageList(img){
    this.latestImageList = img;
    console.log(this.latestImageList);
  }

  getLatestImageList(){
     return this.latestImageList;
  }

}
