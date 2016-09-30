///<reference path="../../typings/index.d.ts"/>
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import "rxjs/Rx";

import {AppComponent} from "./app.component";

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent
    ],
    // modules
    imports: [
        BrowserModule,
        HttpModule
    ],
    // providers
    providers: [
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
