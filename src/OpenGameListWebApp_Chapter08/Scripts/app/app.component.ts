import {Component, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
    selector: "opengamelist",
    template: `
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <input type="checkbox" id="navbar-toggle-cbox">
        <div class="navbar-header">
            <label for="navbar-toggle-cbox" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </label>
            <a class="navbar-brand" href="javascript:void(0)">
                <img alt="logo" src="/img/logo.svg" />
            </a>
        </div>
        <div class="collapse navbar-collapse" id="navbar">
            <ul class="nav navbar-nav">
                <li [class.active]="isActive([''])">
                    <a class="home" [routerLink]="['']">Home</a>
                </li>
                <li [class.active]="isActive(['about'])">
                    <a class="about" [routerLink]="['about']">About</a>
                </li>
                <li *ngIf="!authService.isLoggedIn()" [class.active]="isActive(['login'])">
                    <a class="login" [routerLink]="['login']">Login</a>
                </li>
                <li *ngIf="authService.isLoggedIn()">
                    <a class="logout" href="javascript:void(0)" (click)="logout()">Logout</a>
                </li>
                <li *ngIf="authService.isLoggedIn()" [class.active]="isActive(['item/edit', 0])">
                    <a class="add" [routerLink]="['item/edit', 0]">Add New</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<h1 class="header">{{title}}</h1>
<div class="main-container">
    <router-outlet></router-outlet>
</div>
    `
})

export class AppComponent {
    title = "OpenGameList";

    constructor(
        public router: Router,
        public authService: AuthService,
        public zone: NgZone) {
        if (!(<any>window).externalProviderLogin) {
            var self = this;
            (<any>window).externalProviderLogin = function (auth) {
                self.zone.run(() => {
                    self.externalProviderLogin(auth);
                });
            }
        }
    }

    isActive(data: any[]): boolean {
        return this.router.isActive(
            this.router.createUrlTree(data),
            true);
    }

    logout(): boolean {
        // logs out the user, then redirects him to Welcome View.
        this.authService.logout().subscribe(result => {
            if (result) {
                this.router.navigate([""]);
            }
        });
        return false;
    }

    externalProviderLogin(auth: any) {
        this.authService.setAuth(auth);
        console.log("External Login successful! Provider: "
            + this.authService.getAuth().providerName);
        this.router.navigate([""]);
    }
}
