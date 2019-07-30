import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './User managment/signup/signup.component';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';
import { LoginComponent } from './User managment/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { ForgetComponent } from './User managment/forget/forget.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { HeaderComponent } from './header/header.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FriendsComponent } from './friends/friends.component';
import { SocketService } from './socket.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthfailedComponent } from './authfailed/authfailed.component';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ForgetComponent,
    TodoListComponent,
    HeaderComponent,
    FriendsComponent,
    NotfoundComponent,
    AuthfailedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot([
      {path:"",component:LoginComponent},
      {path:"signup",component:SignupComponent},
      {path:"forget",component:ForgetComponent},
      {path:"failed",component:AuthfailedComponent},
      {path:"user/:userId",component:TodoListComponent,pathMatch:"full"},
      {path:"user/:userId/friends",component:FriendsComponent,pathMatch:"full"},
      {path:"user/:userId/friendList/:friendName",component:TodoListComponent,pathMatch:"full"},
      {path:"**",component:NotfoundComponent},
    ])
  ],
  providers: [AppService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
