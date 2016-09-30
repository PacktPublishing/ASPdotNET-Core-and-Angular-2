///<reference path="../../typings/index.d.ts"/>
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import "rxjs/Rx";

import {AppComponent} from "./app.component";
import {ItemListComponent} from "./item-list.component";
import {ItemDetailComponent} from "./item-detail.component";
import {ItemService} from "./item.service";

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent,
        ItemListComponent,
        ItemDetailComponent
    ],
    // modules
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule
    ],
    // providers
    providers: [
        ItemService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
