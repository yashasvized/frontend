import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  public onlineList= [];


  constructor() { 
    this.socket = io("http://localhost:3000");
    console.log("hello");
  }

  ngOnInit() {
  }


   // events to be listened 

   public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser
  

  public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        console.log("gggg")

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId

  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  } // end sendChatMessage

  
  public postForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('post-msg', chatMsgObject);

  } // end postForFriendsMessage

  public deleteForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('del-msg', chatMsgObject);

  } // end deleteForFriendsMessage

  public checkForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('check-msg', chatMsgObject);

  } // end  checkForFriendsMessage

  public checksubForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('checksub-msg', chatMsgObject);

  } // end checksubForFriendsMessage

  public updateForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('update-msg', chatMsgObject);

  } // end updateForFriendsMessage

  public addSubForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('sub-msg', chatMsgObject);

  } // end addSubForFriendsMessage

  public deleteSubForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('delsub-msg', chatMsgObject);

  } // end deleteSubForFriendsMessage

  public editSubForFriendsMessage = (chatMsgObject) => {

    this.socket.emit('editsub-msg', chatMsgObject);

  } // end editSubForFriendsMessage

  public AcceptFriendreqMessage = (chatMsgObject) => {

    this.socket.emit('accept', chatMsgObject);

  } // end AcceptFriendreqMessage

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public authfailed = () => {

    return Observable.create((observer) => {

      this.socket.on("auth-error", (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser
}
