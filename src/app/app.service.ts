import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) { }

  onlineusers = [];

  currentFriend;


  url = "http://localhost:3000"

  
  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }


  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public postListFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('title', data.title)
      .set('subitem', data.subitem)
      .set('edit', data.edit)
      .set('userId', data.userId)
      .set('checked', data.checked)


    return this.http.post(`${this.url}/api/v1/users/postlist`, params);

  } // end of signupFunction function.

  public acceptfriendFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('friendId', data.friendId)

    return this.http.post(`${this.url}/api/v1/users/acceptfriend`, params);

  } // end of signupFunction function.

  public getfriendFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)

    return this.http.post(`${this.url}/api/v1/users/getfriends`, params);

  } // end of signupFunction function.

  public deleteListFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)

    return this.http.post(`${this.url}/api/v1/users/delete`, params);

  } // end of signupFunction function.

  public deletesubFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('content',data.content)


    return this.http.post(`${this.url}/api/v1/users/deletesub`, params);

  } // end of signupFunction function.

  public updateListFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('title', data.title)
      .set('content',data.content)
      .set('subedit',data.subedit)


    return this.http.post(`${this.url}/api/v1/users/edit`, params);

  } // end of signupFunction function.

  public SaveFriendActionFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('title', data.title)
      .set('edit',data.edit)
      .set('userName',data.userName)
      .set('friendName',data.friendName)
      .set('userId',data.userId)
      .set('friendId',data.friendId)
      .set('action',data.action)
      .set('index',data.index)
      .set('previousValue',data.previousValue)
      .set('subitemIndex',data.subitemIndex)


    return this.http.post(`${this.url}/api/v1/users/saveaction`, params);
  }

    public getFriendActionFunction(data): Observable<any> {

      const params = new HttpParams()

        .set('userId',data.userId)
        
      return this.http.post(`${this.url}/api/v1/users/getaction`, params);

  } // end of signupFunction function.

  public geteveryFriendActionFunction(data): Observable<any> {

    const params = new HttpParams()

      .set('userId',data.userId)
      
    return this.http.post(`${this.url}/api/v1/users/getallaction`, params);

} // end of signupFunction function.

  public updatecheckFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('checked', data.checked)
      .set('userId',data.userId)


    return this.http.post(`${this.url}/api/v1/users/updatecheck`, params);

  } // end of signupFunction function.

  public updatechecksubFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('checked', data.checked)
      .set('edits', data.edits)



    return this.http.post(`${this.url}/api/v1/users/updatechecksub`, params);

  } // end of signupFunction function.

  public editsubFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('content',data.content)
      .set('subedit',data.subedit)


    return this.http.post(`${this.url}/api/v1/users/editsub`, params);

  } // end of signupFunction function.

  public updatesubFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('edits', data.edits)
      .set('content',data.content)


    return this.http.post(`${this.url}/api/v1/users/updatesub`, params);

  } // end of signupFunction function.

  public addFriendFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('friendId', data.friendId)
      .set('userId', data.userId)
      .set('userName',data.userName)
      .set('friendName',data.friendName)


    return this.http.post(`${this.url}/api/v1/users/sendreq`, params);

  } // end of signupFunction function.

  public getsentreqFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)


    return this.http.post(`${this.url}/api/v1/users/getsentreq`, params);

  } // end of signupFunction function.

  public getrecievedreqFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)


    return this.http.post(`${this.url}/api/v1/users/getrecievedreq`, params);

  } // end of signupFunction function.


  public getListFunction(data): Observable<any> {

    return this.http.get(`${this.url}/api/v1/users/${data}`);

  } // end of signupFunction function.

  public getAllUsers1Function(): Observable<any> {

    return this.http.get(`${this.url}/api/v1/users/allusers`);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  public forgetPassword(data): Observable<any> {

    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/confirmation`,params);
  } // forget password.

}

