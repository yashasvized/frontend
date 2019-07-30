import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

  public email: any;
  public password: any;
  public error:any;
  public empty;

  constructor(private router:Router,private appserve:AppService,private toastr:ToastrService) { }

  ngOnInit() {
  }

  onSearchChange(searchValue : string ) {  
    this.error = "";
    this.empty=""
  }

  forget(){
    if (!this.email) {
      this.toastr.warning("enter email")

   } else if (!this.password) {
     this.toastr.warning('enter password')
    

   } else {

     let data = {
       email: this.email,
       password: this.password,
     }
    this.appserve.forgetPassword(data).subscribe((apiresponse)=>{
      if(apiresponse.status =200){

      
        console.log(apiresponse);
        this.toastr.success('Email sent,please click on it to update your password!')
    }else{
      this.toastr.warning('Please register your email account!')
    }
  },(err) => {
    this.toastr.warning('Please register your email account!')

  }
    )} 

}}
