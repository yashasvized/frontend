import { Component, OnInit,HostListener  } from '@angular/core';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../socket.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})


export class TodoListComponent implements OnInit {

  public list = ""
  public subitem;
  public visible = false;
  public todolist = [];
  public sub = false;
  public disable= false;
  public edititem;
  public done =false;
  public saveUsername =false;
  public currentlylogedin;
  public id;
  public friends;
  public friendName;
  public defaultIndex = 0;
  public previousvalue;
  public historyactions;
  stop = false;

  constructor(private appService : AppService,private toastr:ToastrService,private SocketService:SocketService,private activatedrouter:ActivatedRoute,private router:Router) {
    this.activatedrouter.queryParams.subscribe(params => {
      this.id = params['userId'];
  });
   }


  ngOnInit() {
   this.getListFunction();
   this.getMessageFromAUser();
   this.verifyUserConfirmation();
   this.getOnlineUserList();
   this.getFriendFunction();
   this.updatepostFromAfriend();
   this.deletepostFromAfriend();
   this.editpostFromAfriend();
   this.addsubpostFromAfriend();
   this.deletesubpostFromAfriend();
   this.editsubpostFromAfriend();
   this.geteveryfriendactionFunction();
   this.checkFromAfriend();
   this.checksubFromAfriend();
   this.authfailed();
  }

  @HostListener("window:keydown", ['$event'])

 onKeyDown(event:KeyboardEvent) {

  if(event.keyCode == 90 && event.ctrlKey) {
    if(this.friendName==null)
    this.undoListFunction();
    setTimeout(() => {
      if(this.historyactions!=null)
      if(this.historyactions.length==1 ){
        this.historyactions = [];
      }
      this.geteveryfriendactionFunction();
     
    }, 50);
    // rest of your code
  }
  }

  public getFriendFunction: any = () => {
    {
  
      let data = {
        userId:Cookie.get('receiverId'),
      }
  
  
     this.appService.getfriendFunction(data)
       .subscribe((apiResponse) => {
  
         console.log(apiResponse);
  
         if (apiResponse.status === 200) {
  
  
          this.friends = apiResponse.data;

  
          console.log(this.friends);
          if(this.friendName!=null){
            let check = false;
          for(let i=0;i<this.friends.length;i++){
            if(this.friends[i].friendId==this.id && this.friends[i].friendName==this.friendName){
              check=true;
            }
          }

          if(check == false){
            
          let navigationExtras: NavigationExtras = {
            queryParams: {
                'check': false
            }
        };
            this.router.navigate([`/user/${Cookie.get('receiverId')}/friends`],navigationExtras)
          }
        }
    
         } else {
  
  
         }
  
       }, (err) => {
  
  
       });
  
   } // end condition
  
  } // end signupFunction

  public verifyUserConfirmation: any = () => {


    this.SocketService.verifyUser()
      .subscribe((data) => {

        console.log("hello");


        this.SocketService.setUser(Cookie.get('authtoken'));

      });
    }
  
  public getOnlineUserList :any =()=>{

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.currentlylogedin = [];



        for (let x in userList) {

          this.currentlylogedin.push(userList[x]);          

        }


        this.appService.onlineusers = this.currentlylogedin;

      


      }); // end online-user-list
  }


  change(i){
    this.disable = true
    this.updatecheckedFunction(this.todolist[i].listId,i,true);
    console.log(this.todolist[i]);
    setTimeout(()=>{
      this.disable = false
    },100)
  }

  changesub(i,j){
    this.updatecheckedsubFunction(this.todolist[i].listId,i,j,this.todolist[i].subitem[j].subitem,true)
  }

  addsub(i){
   // this.todolist[i].subitem.push({
   //   subitem:this.subitem,
   //   subedit:false
  //  })
  //  this.subitem=""
    this.addsubFunction(this.todolist[i].listId,i,this.todolist[i].subitem.length,true)
   // console.log(this.todolist[i].subitem)

  }

  editHeader(i){
    this.todolist[i].edit = true;
    this.disable = true
    }

    updateHeader(i){
    //  this.todolist[i].title = this.edititem
    //  this.disable= false;
    //  this.todolist[i].edit = false;
    console.log(this.todolist[i].listId)
      this.updateListFunction(this.todolist[i].listId,i,true)
    }
    deletesubitem(i,j){
     // this.todolist[i].subitem.splice(j,1);
     console.log(this.todolist[i].subitem[j].subitem);
      this.deletessubFunction(this.todolist[i].listId,this.todolist[i].subitem[j].subitem,i,j,true)
    }
 
 deleteHeader(i){
   console.log(i);
   this.disable = true
   console.log(this.todolist[i].listId)
   this.deletesListFunction(this.todolist[i].listId,i,true);
   setTimeout(()=>{
     this.disable = false
   },100)
//this.getListFunction();
}

 editsub(i,j){
   console.log(this.todolist[i].subitem[j].subedit)
   this.todolist[i].subitem[j].subedit = true;
   this.disable = true
 }

 updateSub(i,j){
 // this.todolist[i].subitem[j].subitem = this.edititem
 // this.disable= false;
 // this.todolist[i].subitem[j].subedit = false;
  this.updatesubFunction(this.todolist[i].listId,i,j,true);
}


  makeVisible(){
    this.visible = true;
  }
  addToList(list){
    this.postListFunction(this.todolist.length); 
    console.log(this.todolist.length);
  }

  undo(){
    this.stop = true
    setTimeout(()=>{
      this.stop = false;
    },50)
    this.undoListFunction();
    setTimeout(() => {
      if(this.historyactions!=null)
      if(this.historyactions.length==1 ){
        this.historyactions = [];
      }
      this.geteveryfriendactionFunction();
     
    }, 50);
  
  }


  public postListFunction: any = (defaultIndex) => {


    if (!this.list) {
      this.toastr.warning('enter list name')

    } 
    else {

      let data = {
        userId:this.id,
        title: this.list,
        defaultIndex:defaultIndex,
        content: '',
        subitem:[],
        edit:false,
        subedit:false,
        checked:false,
        friends:this.friends,
      }

     

      console.log(this.friends);


      this.appService.postListFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Post successful');

            this.todolist.splice(defaultIndex,0,{
              title: apiResponse.data.title,
              listId: apiResponse.data.listId,
              subitem:[],
              edit:false,
              subedit:false
            });

            let data1 = {
              userId:this.id,
              title: this.list,
              currentId:Cookie.get('receiverName'),
              defaultIndex:defaultIndex,
              content: '',
              subitem:[],
              friendName:this.friendName,
              edit:false,
              subedit:false,
              friends:this.friends,
              listId:apiResponse.data.listId
            }

            console.log(defaultIndex)

              this.SocketService.postForFriendsMessage(data1);
            


            console.log(Cookie.get('receiverId'))

            let info = {
              friendName:Cookie.get('receiverName'),
              userName:this.friendName,
              friendId:Cookie.get('receiverId'),
              userId:this.id,
              
              listId:apiResponse.data.listId,
              index:defaultIndex,
              subitemIndex:-1,
              action:"postlist"
            }
              if(this.friendName!==null)
            this.savefriendaction(info);

          } else {

           this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

  public getMessageFromAUser :any =()=>{


    this.SocketService.chatByUserId(Cookie.get('receiverId'))
    .subscribe((data)=>{

     console.log(data);
     
      this.toastr.success("Friend request recieved");


    });//end subscribe

}// end get message from a user 

public updatepostFromAfriend :any =()=>{

  console.log(Cookie.get('receiverId')+"1")



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"1")
  .subscribe((data)=>{

    console.log(data.listId);

    this.geteveryfriendactionFunction();

    if(data.userId==this.id){

    this.todolist.splice(data.defaultIndex,0,{
      title: data.title,
      listId: data.listId,
      subitem:[],
      edit:false,
      subedit:false
      
    });
  }
    this.toastr.success(data.currentId+" has posted "+data.title)
  

  });//end subscribe

}// end get message from a user 

public deletepostFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"2")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();

    if(data.userId==this.id){

    this.todolist.splice(data.index,1);

    this.toastr.success(data.currentId+" has deleted "+data.title)

    }
  });//end subscribe

}// end get message from a user 

public editpostFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"3")
  .subscribe((data)=>{


    this.geteveryfriendactionFunction();

    if(data.userId==this.id){

    this.todolist[data.index].title = data.title
    this.disable= false;
   this.todolist[data.index].edit = false;
   this.edititem="";
    console.log("ez");

    this.toastr.success(data.currentId+" has edited "+data.title)
    }
  });//end subscribe

}// end get message from a user 

public addsubpostFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"4")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();
    if(data.userId==this.id){

    this.todolist[data.index].subitem.splice(data.j,0,{
      subitem:data.content,
      subedit:false
    })
    this.subitem=""

    this.toastr.success(data.currentId+" has posted sub "+data.content)

  }
  });//end subscribe

}// end get message from a user 

public checkFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"7")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();

  console.log(this.todolist[data.i])

  if(data.userId==this.id){


    this.todolist[data.i].checked = !this.todolist[data.i].checked ;
    this.toastr.success(data.currentId+" has checked "+data.title)
  }     



  });//end subscribe

}// end get message from a user 

public checksubFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"8")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();

  console.log(this.todolist[data.i])

  if(data.userId==this.id){


    this.todolist[data.i].subitem[data.j].checked = !this.todolist[data.i].subitem[data.j].checked   

    this.toastr.success(data.currentId+" has checked sub "+data.title)
  }

  });//end subscribe

}// end get message from a user 

public deletesubpostFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"5")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();
    if(data.userId==this.id){

    console.log(this.todolist[data.i].subitem[data.j])
    this.todolist[data.i].subitem.splice(data.j,1);
    console.log("ttttt")

    this.toastr.success(data.currentId+" has deleted sub "+data.content)
    }
  });//end subscribe

}// end get message from a user 

public editsubpostFromAfriend :any =()=>{



  this.SocketService.chatByUserId(Cookie.get('receiverId')+"6")
  .subscribe((data)=>{

    this.geteveryfriendactionFunction();
    if(data.userId==this.id){

    this.todolist[data.i].subitem[data.j].subitem = data.content;
    this.todolist[data.i].subitem[data.j].subedit = false;
    this.disable = false
   this.edititem ="";

   this.toastr.success(data.currentId+" has edited sub "+data.content)
    }
    
  });//end subscribe

}// end get message from a user 

public authfailed :any =()=>{


 

  this.SocketService.authfailed()
  .subscribe((data)=>{

    
  });//end subscribe

}// end get message from a user 


public undoListFunction: any = () => {
  {
   let data = {
     userId:Cookie.get('receiverId')
   }


   console.log(data);

   this.appService.getFriendActionFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {

        console.log(apiResponse.data);

           if(apiResponse.data.action=="postlist"){
               this.deletesListFunction(apiResponse.data.listId,apiResponse.data.index,false);
           }
           else if(apiResponse.data.action=="deletelist"){
             this.list = apiResponse.data.previousValue
             this.postListFunction(apiResponse.data.index);
           }  else if(apiResponse.data.action=="updatelist"){
           this.edititem = apiResponse.data.previousValue;
            this.updateListFunction(apiResponse.data.listId,apiResponse.data.index,false);
           }
           else if(apiResponse.data.action=="addsub"){
             console.log(apiResponse.data.index);
             this.deletessubFunction(apiResponse.data.listId,apiResponse.data.previousValue,apiResponse.data.index,apiResponse.data.subitemIndex,false);
            } 
            else if(apiResponse.data.action=="delsub"){
              this.subitem = apiResponse.data.previousValue;
              this.addsubFunction(apiResponse.data.listId,apiResponse.data.index,apiResponse.data.subitemIndex,false);
             } 
             else if(apiResponse.data.action=="updatesub"){
              this.edititem = apiResponse.data.previousValue;
              this.updatesubFunction(apiResponse.data.listId,apiResponse.data.index,apiResponse.data.subitemIndex,false);
             } else if(apiResponse.data.action=="check"){
                this.updatecheckedFunction(apiResponse.data.listId,apiResponse.data.index,false)
             }
             else if(apiResponse.data.action=="checksub"){
              this.updatecheckedsubFunction(apiResponse.data.listId,apiResponse.data.index,apiResponse.data.subitemIndex,apiResponse.data.previousValue,false)
           }

       } else {

        this.toastr.error("No more undo actions left");

       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition

} // end signupFunction

public geteveryfriendactionFunction: any = () => {
  {
   let data = {
     userId:Cookie.get('receiverId')
   }


   console.log(data);

   this.appService.geteveryFriendActionFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);


       if (apiResponse.status === 200) {

        console.log(apiResponse.data);

        this.historyactions = apiResponse.data;



       } else {


       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition

} // end signupFunction

  public deletesListFunction: any = (listid,i,truth) => {
     {
      let data = {
        listId:listid,
        userId:this.id,
        friends:this.friends,
        friendName:this.friendName,
        index:i,
        currentId:Cookie.get('receiverName'),
        title:this.todolist[i].title,
      }

 
    if(truth== true){

  let info = {
    friendName:Cookie.get('receiverName'),
    userName:this.friendName,
    friendId:Cookie.get('receiverId'),
    userId:this.id,
   previousValue:this.todolist[i].title,
    listId:listid,
    index:i,
    subitemIndex:-1,
    action:"deletelist"
  } 
   if(this.friendName!==null){
  this.savefriendaction(info);
  }
    }
      this.SocketService.deleteForFriendsMessage(data);

      console.log(data);

      this.appService.deleteListFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

           

            this.toastr.success('Delete successful');
            this.todolist.splice(i,1);

            

          } else {


          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

  public deletessubFunction: any = (listid,content,i,j,truth) => {
    {
     let data = {
       listId:listid,
       content:content,
       userId:this.id,
       i:i,
       friendName:this.friendName,
       j:j,
       friends:this.friends,
       title:content,
       currentId:Cookie.get('receiverName')
     }

     console.log(data);

     this.SocketService.deleteSubForFriendsMessage(data);
     this.appService.deletesubFunction(data)
       .subscribe((apiResponse) => {

         console.log(apiResponse);

         if (apiResponse.status === 200) {

          if(truth){
            let info = {
              friendName:Cookie.get('receiverName'),
              userName:this.friendName,
              friendId:Cookie.get('receiverId'),
              userId:this.id,
              listId:listid,
              previousValue:content,
              index:i,
              subitemIndex:j,
              action:"delsub"
            }
              if(this.friendName!==null){
                this.savefriendaction(info);
              }
          }

           this.toastr.success('Delete successful');
           this.todolist[i].subitem.splice(j,1);

         } else {


         }

       }, (err) => {

         this.toastr.error('some error occured');

       });

   } // end condition

 } // end signupFunction

  public updateListFunction: any = (listid,i,truth) => {

    if (!this.edititem) {
      this.toastr.warning('enter updated name')

    } 
    else{

    {

     let data = {
       listId:listid,
       userId:this.id,
       friendName:this.friendName,
       title:this.edititem,
       content:this.subitem,
       subedit:false,
       friends:this.friends,
       index:i,
       currentId:Cookie.get('receiverName')
     }

    
     this.SocketService.updateForFriendsMessage(data);
     console.log(data);

     this.appService.updateListFunction(data)
       .subscribe((apiResponse) => {

         console.log(apiResponse);

         if (apiResponse.status === 200) {

          if(truth){

          let info = {
            friendName:Cookie.get('receiverName'),
            userName:this.friendName,
            friendId:Cookie.get('receiverId'),
            userId:this.id,
            previousValue:this.todolist[i].title,
            listId:listid,
            index:i,
            subitemIndex:-1,
            action:"updatelist"
          }
          if(this.friendName!==null)
          this.savefriendaction(info);
        }
            

           this.toastr.success('Update successful');
           this.todolist[i].title = this.edititem
             this.disable= false;
            this.todolist[i].edit = false;
            this.edititem="";

         }
          else {


         }

       }, (err) => {

         this.toastr.error('some error occured');

       });

   } // end condition
  }
 } // end signupFunction


 public updatecheckedFunction: any = (listid,i,truth) => {

  {
    if(this.todolist[i].checked == false){
      this.todolist[i].checked = true
    }else{
      this.todolist[i].checked = false
    }

   let data = {
     listId:listid,
     checked:this.todolist[i].checked,
     i:i,
     title:this.todolist[i].title,
     currentId:this.friendName,
     userId:this.id,
     friendName:this.friendName,
     friends:this.friends
   }

   if(truth== true){

    let info = {
      friendName:Cookie.get('receiverName'),
      userName:this.friendName,
      friendId:Cookie.get('receiverId'),
      userId:this.id,
     previousValue:this.todolist[i].title,
      listId:listid,
      index:i,
      subitemIndex:-1,
      action:"check"
    } 
     if(this.friendName!==null){
    this.savefriendaction(info);
    }
  }

   console.log(this.todolist[i].checked);

   this.appService.updatecheckFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {

       console.log("gfgdf")

       this.SocketService.checkForFriendsMessage(data);

       }
        else {


       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition

} // end signupFunction

public updatecheckedsubFunction: any = (listid,i,j,edits,truth) => {

  {

    let current;

    console.log(this.todolist[i].subitem[j].checked)

    if(this.todolist[i].subitem[j].checked == true){
      this.todolist[i].subitem[j].checked = false
        current = ""
    }
    else{
      this.todolist[i].subitem[j].checked = true
      current = "haha"
    }


   let data = {
     listId:listid,
     userId:this.id,
     checked:current,
     title:this.todolist[i].subitem[j].subitem,
     currentId:this.friendName,
     i:i,
     j:j,
     edits:edits,
     friends:this.friends
   }

   if(truth== true){

    let info = {
      friendName:Cookie.get('receiverName'),
      userName:this.friendName,
      friendId:Cookie.get('receiverId'),
      userId:this.id,
     previousValue:this.todolist[i].subitem[j].subitem,
      listId:listid,
      index:i,
      subitemIndex:j,
      action:"checksub"
    } 
     if(this.friendName!==null){
    this.savefriendaction(info);
    }
  }

   this.SocketService.checksubForFriendsMessage(data);

   console.log(data.checked)

   this.appService.updatechecksubFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {


       }
        else {


       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition

} // end signupFunction



 public addsubFunction: any = (listid,i,j,truth) => {

  if (!this.subitem) {
    this.toastr.warning('enter sublist name')

  } 
  else{

  {

   let data = {
     listId:listid,
     title:this.edititem,
     userId:this.id,
     content:this.subitem,
     subedit:false,
     index:i,
     j:j,
     friends:this.friends,
     currentId:Cookie.get('receiverName')
   }
   this.SocketService.addSubForFriendsMessage(data);
   console.log(data);

   this.appService.editsubFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       

      if(apiResponse.status=201){

        if(truth){
        let info = {
          friendName:Cookie.get('receiverName'),
          userName:this.friendName,
          friendId:Cookie.get('receiverId'),
          userId:this.id,
          listId:listid,
          previousValue:this.subitem,
          index:i,
          subitemIndex:j,
          action:"addsub"
        }
            if(this.friendName!==null)
        this.savefriendaction(info);

      }
       this.todolist[i].subitem.splice(j,0,{
          subitem:this.subitem,
          subedit:false
        })
        this.subitem=""
        console.log(apiResponse)
    
       }
        else {

        this.toastr.error(apiResponse.message);

       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition
  }
} // end signupFunction

 public updatesubFunction: any = (listid,i,j,truth) => {

  if (!this.edititem) {
    this.toastr.warning('enter updated name')

  } 
  else{

  {

   let data = {
     listId:listid,
     content:this.edititem,
     edits:this.todolist[i].subitem[j].subitem,
     friends:this.friends,
     userId:this.id,
     i:i,
     j:j,
     currentId:Cookie.get('receiverName')
   }
   this.SocketService.editSubForFriendsMessage(data);
   console.log(data);

   this.appService.updatesubFunction(data)
     .subscribe((apiResponse) => {

       console.log(apiResponse);

       if (apiResponse.status === 200) {

        if(truth){
          let info = {
            friendName:Cookie.get('receiverName'),
            userName:this.friendName,
            friendId:Cookie.get('receiverId'),
            userId:this.id,
            listId:listid,
            previousValue:this.todolist[i].subitem[j].subitem,
            index:i,
            subitemIndex:j,
            action:"updatesub"
          }
            if(this.friendName!==null)
          this.savefriendaction(info);
  
        }

         this.toastr.success('Update successful');
         this.todolist[i].subitem[j].subitem = this.edititem
         this.todolist[i].subitem[j].subedit = false;
         this.disable = false
        this.edititem ="";
       }
        else {

        this.toastr.error(apiResponse.message);

       }

     }, (err) => {

       this.toastr.error('some error occured');

     });

 } // end condition
  }
} // end signupFunction

public savefriendaction: any = (data) => {

    this.appService.SaveFriendActionFunction(data)
      .subscribe((apiResponse) => {

        console.log(apiResponse);

        if (apiResponse.status === 200) {

          this.toastr.success('List returned successful');


        } else {


        }

      }, (err) => {

        this.toastr.error('some error occured');

      });

  } // end condition



  public getListFunction: any = () => {

    this.id= this.activatedrouter.snapshot.paramMap.get("userId")

    this.friendName= this.activatedrouter.snapshot.paramMap.get("friendName")

    if(this.id!=Cookie.get('receiverId') && this.friendName===null){
      this.router.navigate(["/failed"]);
    }


      this.appService.getListFunction(this.id)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('List returned successful');

                
            for(let i=0;i<apiResponse.data.length;i++){
              let allsubitem = [];
              for(let j=0;j<apiResponse.data[i].subitem.length;j++){
              if(apiResponse.data[i].subitem[j].subitem!=undefined){
                  allsubitem.push({subitem:apiResponse.data[i].subitem[j].subitem,
                    subedit:false,checked:Boolean(apiResponse.data[i].subitem[j].checked)})
            }
            }
            this.todolist.push({
              title: apiResponse.data[i].title,
              listId: apiResponse.data[i].listId,
              subitem:allsubitem,
              checked:apiResponse.data[i].checked,
              edit:false,
              subedit:false
            });
            }
              console.log(this.todolist);

          } else if(apiResponse.status === 500) {
            this.router.navigate(["/failed"])

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction


