import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile/profile.service";
import { Observable, Subscription } from "rxjs";
import { ProfileModel } from "../register/register.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  previewUrl$: Observable<string>;
  profileValue: ProfileModel = {
    addressType: "",
    age: 0,
    country: "",
    email: "",
    file: "",
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    subscribe: false,
    tags: [],
    companyAddress1: "",
    companyAddress2: "",
    homeAddress1: "",
    homeAddress2: "",
  };
  isShowRegisterModal: boolean;
  private isShowRegisterModalSubscription: Subscription;
  private profileValueSubscription: Subscription;

  imageFile: string | ArrayBuffer;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileValueSubscription = this.profileService.profileValue$.subscribe(
      (value) => {
        this.profileService.getProfile().subscribe((response) => {
          this.profileValue = response;
        });
      }
    );

    this.profileService.getProfile().subscribe((response) => {
      this.profileValue = response;
    });

    this.isShowRegisterModalSubscription =
      this.profileService.isShowRegisterModel.subscribe((value) => {
        this.isShowRegisterModal = value;
      });
  }

  showRegisterModal() {
    this.profileService.showRegiserModel(true);
  }

  onFileChange(event) {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length) {
      const [file] = fileInput.files;
      this.profileService.updateFile(file);
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageFile = e.target.result;
      this.profileService.updateFile(this.imageFile).subscribe((response) => {
        this.profileService.getProfile().subscribe((response1) => {
          this.profileValue = response1;
        });
      });
    };

    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.isShowRegisterModalSubscription.unsubscribe();
    this.profileValueSubscription.unsubscribe();
  }
}
