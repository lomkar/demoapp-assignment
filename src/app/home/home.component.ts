import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ProfileService } from "../services/profile/profile.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit,OnDestroy {
  constructor(private profileService: ProfileService) {}
  isShowRegisterModal: boolean;
  private isShowRegisterModalSubscription: Subscription;
  ngOnInit() {
    this.isShowRegisterModalSubscription =
      this.profileService.isShowRegisterModel.subscribe((value) => {
        this.isShowRegisterModal = value;
      });
  }

  showRegisterModal() {
    this.profileService.showRegiserModel(true);
  }
  ngOnDestroy(): void {
    this.isShowRegisterModalSubscription.unsubscribe();
  }
  
}
