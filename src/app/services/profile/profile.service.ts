import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { ProfileModel } from "src/app/register/register.model";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  isEdit = new BehaviorSubject<boolean>(false);
  isShowRegisterModel = new BehaviorSubject<boolean>(false);

  private profileDataSubject = new BehaviorSubject<ProfileModel>({
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
    state: "",
    country: "",
    subscribe: false,
    addressType: "home",
    file: null,
    tags: [],
    phone: "",
  });
  profileValue$ = this.profileDataSubject.asObservable();

  updateProfileData(newValue: ProfileModel) {
    this.profileDataSubject.next(newValue);
  }

  getProfileData() {
    return this.profileDataSubject.value;
  }

  updateFile(file: File) {
    let currData = this.getProfileData();
    this.profileDataSubject.next({ ...currData, file });
  }

  constructor() {}

  showRegiserModel(isShow: boolean) {
    this.isShowRegisterModel.next(isShow);
  }

  setIsEditting(isEdit: boolean) {
    this.isEdit.next(isEdit);
  }
}
