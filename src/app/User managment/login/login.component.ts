import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router,private appserve:AppService,private toastr:ToastrService) { }

  public email: any;
  public password: any;
  public error:any;
  public empty;

  ngOnInit() {
  }
  onSearchChange(searchValue : string ) {  
    this.error = "";
    this.empty=""
  }



  login(){
   // this.router.navigate["/user"]
    console.log(this.email);
    if (!this.email) {
       this.toastr.warning("enter email")

    } else if (!this.password) {
      this.toastr.warning('enter password')
     

    } else {

      let data = {
        email: this.email,
        password: this.password,
      }
      this.appserve.signinFunction(data).subscribe((apiResponse)=>{
        if (apiResponse.status === 200) {

          this.toastr.success('Login successful');

          setTimeout(() => {
            console.log(apiResponse)
            Cookie.set('authtoken', apiResponse.data.authToken);
            
            Cookie.set('receiverId', apiResponse.data.userDetails.userId);
           
            Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          
            this.appserve.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            this.router.navigate(["/user",apiResponse.data.userDetails.userId])

          }, 2000);

        } else {
          this.error = apiResponse.message;
          console.log(this.error);
       //   this.toastr.error(apiResponse.message);

        }

      }, (err) => {
        console.log(err.error);
        if(err.error.status!=404){
        this.error = err.error.message;
        }
        else{
          this.empty = err.error.message;
        }
     //   this.toastr.error('some error occured');

      });
      }
      }
  

}
