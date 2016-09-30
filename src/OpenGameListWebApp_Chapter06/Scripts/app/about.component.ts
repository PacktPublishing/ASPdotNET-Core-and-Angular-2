import {Component} from "@angular/core";

@Component({
    selector: "about",
    template: `
        <h2>{{title}}</h2>
        <div>
            OpenGameList: a production-ready, fully-featured SPA sample powered by ASP.NET Core Web API and Angular2.
        </div>
    `
})

export class AboutComponent {
    title = "About";
}
