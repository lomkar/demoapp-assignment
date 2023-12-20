import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ProfileModel } from "src/app/register/register.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  isEdit = new BehaviorSubject<boolean>(false);
  isShowRegisterModel = new BehaviorSubject<boolean>(false);
  private apiUrl = "http://localhost:3000/profile";

  private profileDataSubject = new BehaviorSubject<Number>(0);
  profileValue$ = this.profileDataSubject.asObservable();

  changeProfileDataSubject() {
    let curr = Number(this.getProfileData());
    curr = curr++;
    this.profileDataSubject.next(curr);
  }

  getProfileData() {
    return this.profileDataSubject.value;
  }

  constructor(private http: HttpClient) {}

  showRegiserModel(isShow: boolean) {
    this.isShowRegisterModel.next(isShow);
  }

  setIsEditting(isEdit: boolean) {
    this.isEdit.next(isEdit);
  }

  getProfile(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addProfile(profileData: ProfileModel): Observable<any> {
    return this.http.post(this.apiUrl, profileData);
  }

  updateProfile(profileData: ProfileModel): Observable<any> {
    return this.http.put(this.apiUrl, profileData);
  }

  updateFile(file: string | ArrayBuffer) {
    return this.http.patch(this.apiUrl, { file });
  }
}
