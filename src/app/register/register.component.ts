import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ProfileService } from "../services/profile/profile.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { ProfileModel } from "./register.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  constructor(private profileService: ProfileService, private router: Router) {}

  myFormProfileValue: ProfileModel;
  myForm: FormGroup;
  tag: string = "";
  selectedFile: File;
  previewUrl$: Observable<string>;

  ngOnInit() {
    if (this.profileService.isEdit) {
      let profileValue = this.profileService.getProfileData();
      this.myForm = new FormGroup({
        firstName: new FormControl(profileValue.firstName, [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/), // Alphabetic characters only
        ]),
        lastName: new FormControl(profileValue.lastName, Validators.required),
        email: new FormControl(profileValue.email, [
          Validators.required,
          Validators.email,
        ]),
        phone: new FormControl(profileValue.phone, Validators.required),
        age: new FormControl(profileValue.age, Validators.required),
        state: new FormControl(profileValue.state, Validators.required),
        country: new FormControl(profileValue.country, Validators.required),
        subscribe: new FormControl(profileValue.subscribe,Validators.required),
        tags: new FormArray([]),
        addressType: new FormControl(
          profileValue.addressType,
          Validators.required
        ), 
        homeAddress1: new FormControl(profileValue.homeAddress1),
        homeAddress2: new FormControl(profileValue.homeAddress2),
        companyAddress1: new FormControl(profileValue.companyAddress1),
        companyAddress2: new FormControl(profileValue.companyAddress2),
        file: new FormControl(profileValue.file, [Validators.required]),
      });

      for (let i = 0; i < profileValue.tags.length; i++) {
        const control = new FormControl(
          profileValue.tags[i],
          Validators.required
        );

        (<FormArray>this.myForm.get("tags")).push(control);
      }
    } else {
      this.myForm = new FormGroup({
        firstName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/), // Alphabetic characters only
        ]),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, Validators.required),
        age: new FormControl(0, Validators.required),
        state: new FormControl(null, Validators.required),
        country: new FormControl(null, Validators.required),
        subscribe: new FormControl(false,Validators.required),
        tags: new FormArray([]),
        addressType: new FormControl("home", Validators.required), // Default to 'home'
        homeAddress1: new FormControl(""),
        homeAddress2: new FormControl(""),
        companyAddress1: new FormControl(""),
        companyAddress2: new FormControl(""),
        file: new FormControl(null, [Validators.required]),
      });
    }

    this.previewUrl$ = this.getPreviewUrl();
  }

  onAddTag(inputTag: HTMLInputElement) {
    const control = new FormControl(inputTag.value, Validators.required);
    (<FormArray>this.myForm.get("tags")).push(control);
  }

  getControls() {
    return (<FormArray>this.myForm.get("tags")).controls;
  }

  get tags() {
    return this.myForm.get("tags") as FormArray;
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.myFormProfileValue = this.myForm.value;
      this.profileService.updateProfileData(this.myFormProfileValue);
      this.closeModal();
      if (!this.profileService.isEdit.value) {
        this.profileService.setIsEditting(true);

        this.router.navigate(["profile"]);
      }
    }
  }

  private getPreviewUrl(): Observable<string> {
    const file = this.myForm.value.file;

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
      this.myForm.patchValue({
        file: file,
      });

      this.previewUrl$ = this.getPreviewUrl();
    }
  }

  closeModal() {
    this.profileService.showRegiserModel(false);
  }
}
