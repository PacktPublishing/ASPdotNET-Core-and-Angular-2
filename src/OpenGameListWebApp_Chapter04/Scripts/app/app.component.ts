import {Component} from "@angular/core";

@Component({
    selector: "opengamelist",
    template: `
        <h1>{{title}}</h1>
            <div class="menu">
                <a class="home" [routerLink]="['']">Home</a>
                | <a class="about" [routerLink]="['about']">About</a>
                | <a class="login" [routerLink]="['login']">Login</a>
            </div>
        <router-outlet></router-outlet>
    `
})

export class AppComponent {
    title = "OpenGameList";
}
