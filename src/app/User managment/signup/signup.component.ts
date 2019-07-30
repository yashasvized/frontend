import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import data from './CountryCodes.json'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router:Router,private appService:AppService,private toastr: ToastrService) { }


  public countries = data;
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public dial:any;

  ngOnInit() {
    console.log(data[1].name)
    this.mobile= this.dial
    this.firstName = this.dial

  }
  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  public signupFunction: any = () => {


    if (!this.firstName) {
      this.toastr.warning('enter first name')

    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobile) {
     this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')
     

    }else if(!this.dial){
      this.toastr.warning('Select country')
    }
    
    else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.dial+this.mobile,
        email: this.email,
        password: this.password,
      }

      console.log(data);

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

           this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
