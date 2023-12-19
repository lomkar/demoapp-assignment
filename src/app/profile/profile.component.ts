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
  profileValue: ProfileModel;
  isShowRegisterModal: boolean;
  private isShowRegisterModalSubscription: Subscription;
  private profileValueSubscription: Subscription;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileValueSubscription = this.profileService.profileValue$.subscribe((value) => {
      this.profileValue = value;
      this.previewUrl$ = this.getPreviewUrl();
    });
    
    this.isShowRegisterModalSubscription =
      this.profileService.isShowRegisterModel.subscribe((value) => {
        this.isShowRegisterModal = value;
      });
  }

  showRegisterModal() {
    this.profileService.showRegiserModel(true);
  }

  private getPreviewUrl(): Observable<string> {
    const file = this.profileValue.file;

    if (file) {
      return new Observable<string>((observer) => {
        const reader = new FileReader();

        reader.onload = () => {
          observer.next(reader.result as string);
          observer.complete();
        };

        reader.onerror = (error) => {
          observer.error(error);
        };

        reader.readAsDataURL(file);
      });
    }

    return new Observable<string>();
  }

  onFileChange(event) {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length) {
      const [file] = fileInput.files;
      this.profileService.updateFile(file);

      this.previewUrl$ = this.getPreviewUrl();
    }
  }

  ngOnDestroy(): void {
    this.isShowRegisterModalSubscription.unsubscribe();
    this.profileValueSubscription.unsubscribe();
  }
}
