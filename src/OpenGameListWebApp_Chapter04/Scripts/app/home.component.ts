import {Component} from "@angular/core";

@Component({
    selector: "home",
    template: `
        <h2>{{title}}</h2>
        <item-list class="latest"></item-list>
        <item-list class="most-viewed"></item-list>
        <item-list class="random"></item-list>
    `,
    styles: [`
        item-list {
            min-width: 332px;
            border: 1px solid #aaaaaa;
            display: inline-block;
            margin: 0 10px;
            padding: 10px;
        }
        item-list.latest {
            background-color: #f9f9f9;
        }
        item-list.most-viewed {
            background-color: #f0f0f0;
        }
        item-list.random {
            background-color: #e9e9e9;
        }
    `]
})

export class HomeComponent {
    title = "Welcome View";
}
