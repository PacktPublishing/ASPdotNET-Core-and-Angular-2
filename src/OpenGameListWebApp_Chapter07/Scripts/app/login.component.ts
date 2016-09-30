import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
    selector: "login",
    template: `
    <div class="login-container">
      <h2 class="form-login-heading">Login</h2>
      <div class="alert alert-danger" role="alert" *ngIf="loginError"><strong>Warning:</strong> Username or Password mismatch</div>
      <form class="form-login" [formGroup]="loginForm" (submit)="performLogin($event)">
        <input formControlName="username" type="text" class="form-control" placeholder="Your username or e-mail address" required autofocus />
        <input formControlName="password" type="password" class="form-control" placeholder="Your password" required />
        <div class="checkbox">
          <label>
            <input type="checkbox" value="remember-me">
            Remember me
          </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
    </div>
    `
})

export class LoginComponent {
    title = "Login";
    loginForm = null;
    loginError = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService) {
        if (this.authService.isLoggedIn()) {
            this.router.navigate([""]);
        }
        this.loginForm = fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });
    }

    performLogin(e) {
        e.preventDefault();
        var username = this.loginForm.value.username;
        var password = this.loginForm.value.password;
        this.authService.login(username, password)
            .subscribe((data) => {
                // login successful
                this.loginError = false;
                var auth = this.authService.getAuth();
                alert("Our Token is: " + auth.access_token);
                this.router.navigate([""]);
            },
            (err) => {
                console.log(err);
                // login failure
                this.loginError = true;
            });
    }
}
