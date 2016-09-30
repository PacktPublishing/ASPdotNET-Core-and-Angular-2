import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "./auth.service";
import {User} from "./user";

@Component({
    selector: "user-edit",
    template: `
<div class="user-container">
    <form class="form-user" [formGroup]="userForm" (submit)="onSubmit()">
        <h2 class="form-user-heading">{{title}}</h2>
        <div class="form-group">
            <input [disabled]="!this.isRegister" formControlName="username" type="text" class="form-control" placeholder="Choose an Username" autofocus />
            <span class="validator-label valid" *ngIf="this.userForm.controls.username.valid">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                valid!
            </span>
            <span class="validator-label invalid" *ngIf="!this.userForm.controls.username.valid && !this.userForm.controls.username.pristine">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                invalid
            </span>
        </div>
        <div class="form-group">
            <input formControlName="email" type="text" class="form-control" placeholder="Type your e-mail address" />
            <span class="validator-label valid" *ngIf="this.userForm.controls.email.valid">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                valid!
            </span>
            <span class="validator-label invalid" *ngIf="!this.userForm.controls.email.valid && !this.userForm.controls.email.pristine">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                invalid
            </span>
        </div>
        <div *ngIf="!this.isRegister" class="form-group">
            <input formControlName="passwordCurrent" type="password" class="form-control" placeholder="Current Password" />
            <span class="validator-label invalid" *ngIf="!this.userForm.controls.passwordCurrent.valid">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                required
            </span>
        </div>
        <div class="form-group">
            <input formControlName="password" type="password" class="form-control" placeholder="Choose a Password" />
            <span class="validator-label valid" *ngIf="this.userForm.controls.password.valid && !this.userForm.controls.password.pristine">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                valid!
            </span>
            <span class="validator-label invalid" *ngIf="!this.userForm.controls.password.valid && !this.userForm.controls.password.pristine">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                invalid
            </span>
        </div>
        <div class="form-group">
            <input formControlName="passwordConfirm" type="password" class="form-control" placeholder="Confirm your Password" />
            <span class="validator-label valid" *ngIf="this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.password.pristine && !this.userForm.hasError('compareFailed')">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                valid!
            </span>
            <span class="validator-label invalid" *ngIf="(!this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.passwordConfirm.pristine) || this.userForm.hasError('compareFailed')">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                invalid
            </span>
        </div>
        <div class="form-group">
            <input formControlName="displayName" type="text" class="form-control" placeholder="Choose a Display Name" />
        </div>
        <div class="form-group">
            <input type="submit" class="btn btn-primary btn-block" [disabled]="!userForm.valid" value="{{this.isRegister ? 'Register' : 'Save'}}" />
        </div>
    </form>
</div>
    `
})

export class UserEditComponent {
    title = "New User Registration";
    userForm: FormGroup ;
    errorMessage = null;
    isRegister: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService) {
        // determine behaviour by fetching the active route
        this.isRegister = (activatedRoute.snapshot.url[0].path === "register");
        if ((this.isRegister && this.authService.isLoggedIn())
            || (!this.isRegister && !this.authService.isLoggedIn())) {
            this.router.navigate([""]);
        }
        if (!this.isRegister) {
            this.title = "Edit Account";
        }
    }

    ngOnInit() {
        this.userForm = this.fb.group(
            {
                username: ["", [
                    Validators.required,
                    Validators.pattern("[a-zA-Z0-9]+")
                ]],
                email: ["", [
                    Validators.required,
                    Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                ]],
                password: ["", [
                    Validators.required,
                    Validators.minLength(6)]],
                passwordConfirm: ["", [
                    Validators.required,
                    Validators.minLength(6)]],
                displayName: ["", null]
            },
            {
                validator: this.compareValidator('password', 'passwordConfirm')
            }
        );

        if (!this.isRegister) {
            this.userForm.addControl("passwordCurrent",
                new FormControl("", Validators.required));
            var password = this.userForm.find("password");
            password.clearValidators();
            password.setValidators(Validators.minLength(6));
            var passwordConfirm =
                this.userForm.find("passwordConfirm");
            passwordConfirm.clearValidators();
            passwordConfirm.setValidators(Validators.minLength(6));

            this.authService.get().subscribe(
                user => {
                    this.userForm.find("username")
                        .setValue(user.UserName);
                    this.userForm.find("email")
                        .setValue(user.Email);
                    this.userForm.find("displayName")
                        .setValue(user.DisplayName);
                }
            );
        }
    }

    compareValidator(fc1: string, fc2: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[fc1];
            let passwordConfirm = group.controls[fc2];
            if (password.value === passwordConfirm.value) {
                return null;
            }
            return { compareFailed: true };
        };
    }

    onSubmit() {
        if (this.isRegister) {
            this.authService.add(this.userForm.value)
                .subscribe((data) => {
                    if (data.error == null) {
                        // registration successful
                        this.errorMessage = null;
                        this.authService.login(
                            this.userForm.value.username,
                            this.userForm.value.password)
                            .subscribe((data) => {
                                // login successful
                                this.errorMessage = null;
                                this.router.navigate([""]);
                            },
                            (err) => {
                                console.log(err);
                                // login failure
                                this.errorMessage =
                                    "Warning: Username or Password mismatch";
                            });
                    } else {
                        // registration failure
                        this.errorMessage = data.error;
                    }
                },
                (err) => {
                    // server/connection error
                    this.errorMessage = err;
                });
        } else {
            let user = new User(
                this.userForm.value.username,
                this.userForm.value.password,
                this.userForm.value.passwordNew,
                this.userForm.value.email,
                this.userForm.value.displayName);
            this.authService.update(user)
                .subscribe((data) => {
                    if (data.error == null) {
                        // update successful
                        this.errorMessage = null;
                        this.router.navigate([""]);
                    } else {
                        // update failure
                        this.errorMessage = data.error;
                    }
                },
                (err) => {
                    // server/connection error
                    this.errorMessage = err;
                });
        }
    }
}
