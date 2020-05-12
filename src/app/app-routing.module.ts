import { ImageComponent } from './images/image/image.component';
import { ImagesComponent } from './images/images.component';
import { ImageListComponent } from './images/image-list/image-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UploadComponent } from './upload/upload.component';
import { CommentsComponent } from './comments/comments.component';
import { HeritageComponent } from './heritage/heritage.component';
import { RecipesComponent } from './recipes/recipes.component';
import { CollectionsComponent } from './collections/collections.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'heritage', component: HeritageComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'recipes', component: RecipesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
