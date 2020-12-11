import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodoComponent } from './components/todo.component';
import { SubTodoComponent } from './components/sub-todo.component';
import { TodoService } from './todo.service';
import { EditComponent } from './components/edit.component';

const ROUTES = [
  { path: '', component: TodoComponent },
  { path:'subtodo/:id', component: SubTodoComponent},
  { path:'edit/:id', component: EditComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    SubTodoComponent,
    EditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
