import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  private onlineList = [];
  private currentlylogedin;
  private disconnectedSocket;
  private friendIdCurrent=Cookie.get('receiverId');
  private friendreqsent=[];
  private friendreqrecieved=[];
  private friends = [];
  private check = true;


  constructor(private SocketService:SocketService,private appservice:AppService,private toastr :ToastrService,private router:Router,private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.check = params["check"];
  });
  
  }
  

  ngOnInit() {
    if(this.check){
      this.toastr.warning("No friend added")
    }
    this.currentlylogedin = this.appservice.onlineusers;
    console.log(this.currentlylogedin);
    this.verifyUserConfirmation();
      this.getMessageFromAUser();
      this.getAllUsersFunction();
      this.getOnlineUserList();
      this.getacceptFromAUser();


      setTimeout(()=>{
      },50)

      setTimeout(()=>{
      },100)
  }

  ngOnViewInit(){

  }

  gotofriendList(user ){
    let id= user.friendId 
    let friendName= user.friendName
    this.router.navigate([`/user/${id}/friendList/${friendName}`])
  }

  addFriend(user,i){
    this.friendIdCurrent= user.userId;
    this.sendMessage(user,i);
    console.log(this.friendIdCurrent);
    let fullName = user.firstName + " " + user.lastName;
    user.userName = fullName;
    this.friendreqsent.push(user);
    this.onlineList.splice(i,1)
  }

  acceptFriend(user,i){
    console.log(user);
    this.friends.push({friendId:user.userId,friendName:user.userName});
    this.friendreqrecieved.splice(i,1)
    this.acceptFriendFunction(user);
    this.acceptFriendreqMessage(user,i)
  }

  onlineListusers(){
    if(this.currentlylogedin!=null){
    for(let i=0;i<this.onlineList.length;i++){
      for(let j=0;j<this.currentlylogedin.length;j++)
      if(this.onlineList[i].userId == this.currentlylogedin[j].userId){
      this.onlineList[i].online = true;
      break;
      }else{
        this.onlineList[i].online = false;
      }
    }

    for(let i=0;i<this.friends.length;i++){
      this.friends[i].online = false;
      for(let j=0;j<this.currentlylogedin.length;j++)
      {
      if(this.friends[i].friendId == this.currentlylogedin[j].userId){
        console.log(this.friends[i].online)
      this.friends[i].online = true;
      console.log(this.friends[i].online)
      break;
      }else{
        this.friends[i].online = false;
      }
    }
    }
  }
  }

  public verifyUserConfirmation: any = () => {


    this.SocketService.verifyUser()
      .subscribe((data) => {

        console.log("hello");

        this.disconnectedSocket = false;

        this.SocketService.setUser(Cookie.get('authtoken'));

      });
    }
  
  public getOnlineUserList :any =()=>{


    this.SocketService.onlineUserList()
      .subscribe((userList) => {




          this.currentlylogedin = userList;          



        
        for(let i=0;i<this.onlineList.length;i++){
          for(let j=0;j<this.currentlylogedin.length;j++)
          if(this.onlineList[i].userId == this.currentlylogedin[j].userId){
          this.onlineList[i].online = true;
          break;
          }else{
            this.onlineList[i].online = false;
          }
        }

        for(let i=0;i<this.friends.length;i++){
          this.friends[i].online = false;
          for(let j=0;j<this.currentlylogedin.length;j++)
          {
          if(this.friends[i].friendId == this.currentlylogedin[j].userId){
            console.log(this.friends[i].online)
          this.friends[i].online = true;
          console.log(this.friends[i].online)
          break;
          }else{
            this.friends[i].online = false;
          }
        }
        }
        console.log(userList)

      }); // end online-user-list
  }

  public getMessageFromAUser :any =()=>{

    console.log(this.friendIdCurrent)

    this.SocketService.chatByUserId(Cookie.get('receiverId'))
    .subscribe((data)=>{

      console.log(data);
     

      this.friendreqrecieved.push({
        userName:data.userName,
        userId:data.userId
      })
      
      this.onlineList.splice(this.onlineList.indexOf(data.userName),1);


    });//end subscribe

}// end get message from a user 

public getacceptFromAUser :any =()=>{


  this.SocketService.chatByUserId(Cookie.get('receiverId')+Cookie.get('receiverName'))
  .subscribe((data)=>{

    console.log(data);
   

    this.friends.push({
      friendName:data.userName,
      friendId:data.userId
    })

    this.friendreqsent.splice(data.i,1);

    this.toastr.success("friend request accepted by"+data.userName)


  });//end subscribe

}// end get message from a user 



  public sendMessage: any = (friend,i) => {

    let fullname = friend.firstName+" "+ friend.lastName;

    let obj = {
      friendId:friend.userId,
      friendName:fullname,
      userId:Cookie.get('receiverId'),
      userName:Cookie.get('receiverName'),
      index:i
    }

    this.appservice.addFriendFunction(obj)
    .subscribe((apiResponse) => {

      console.log(apiResponse);

      if (apiResponse.status === 200) {

        this.toastr.success('request sent');
        this.SocketService.SendChatMessage(obj)

      } else {

       this.toastr.error(apiResponse.message);

      }

    }, (err) => {

      this.toastr.error('some error occured');

    });

} // end condition

public acceptFriendreqMessage: any = (friend,i) => {

  let obj = {
    friendId:friend.userId,
    friendName:friend.userName,
    userId:Cookie.get('receiverId'),
    userName:Cookie.get('receiverName'),
    index:i
  }

      this.toastr.success('request accepted');
      this.SocketService.AcceptFriendreqMessage(obj)



} // end condition

      
  
public getreqsentFunction: any = () => {
  {

    let data = {
      userId:Cookie.get('receiverId')
    }


   this.appservice.getsentreqFunction(data)
     .subscribe((apiResponse) => {


       console.log(apiResponse);

       if (apiResponse.status === 200) {


        this.friendreqsent = apiResponse.data;

        console.log(this.friendreqsent)


       } else {


       }

       this.getreqrecievedFunction();

     }, (err) => {


     });

 } // end condition

} // end signupFunction

public getreqrecievedFunction: any = () => {
  {

    let data = {
      userId:Cookie.get('receiverId')
    }




   this.appservice.getrecievedreqFunction(data)
     .subscribe((apiResponse) => {


       console.log(apiResponse);

       if (apiResponse.status === 200) {

        this.friendreqrecieved = apiResponse.data;

        console.log(apiResponse.data)


       } else {


       }
       this.getFriendFunction(Cookie.get('receiverId'));

     }, (err) => {


     });

 } // end condition

} // end signupFunction

public acceptFriendFunction: any = (user) => {
  {

    let data = {
      userId:Cookie.get('receiverId'),
      friendId:user.userId
    }


   this.appservice.acceptfriendFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {

     

         this.toastr.success('Friend request accepted');

       } else {


       }

     }, (err) => {


     });

 } // end condition

} // end signupFunction

public getFriendFunction: any = (user) => {
  {

    let data = {
      userId:user,
    }


   this.appservice.getfriendFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {


        this.friends = apiResponse.data;

        


       } else {


       }
       this.removeSentUsers();

     }, (err) => {


     });


 } // end condition

} // end signupFunction

public removeSentUsers(){  
           let fakelist =[];
           let total = this.onlineList.length
           console.log(this.friends);
           for(let i = 0;i<total;i++){
            let bool = true;
            if(this.onlineList[i].userId==Cookie.get('receiverId')){
              bool = false;
            }
             for(let j=0;j<this.friendreqsent.length;j++){
              if(this.friendreqsent[j].userId==this.onlineList[i].userId){
                 bool = false;
                 break;
               }
             }
             for(let j=0;j<this.friendreqrecieved.length;j++){
              if(this.friendreqrecieved[j].userId==this.onlineList[i].userId){
                 bool = false;
                 break;
               }
             }
             for(let j=0;j<this.friends.length;j++){
              if(this.friends[j].friendId==this.onlineList[i].userId){
                 console.log(this.onlineList[i]);
                 bool = false;
                 break;
               }
             }
             
             if(bool == true)
             fakelist.push(this.onlineList[i]);
           }
           this.onlineList = fakelist;
           this.onlineListusers()
}


  public getAllUsersFunction: any = () => {
    {


     this.appservice.getAllUsers1Function()
       .subscribe((apiResponse) => {

        console.log( apiResponse.data)


         if (apiResponse.status === 200) {

          this.onlineList = apiResponse.data;


          for(let i=0;i<this.onlineList.length;i++){
            this.onlineList[i].online = false;
          }

      

         } else {


         }
         this.getreqsentFunction();

       }, (err) => {

         this.toastr.error('some error occured');

       });

   } // end condition

 } // end signupFunction
  
  

}