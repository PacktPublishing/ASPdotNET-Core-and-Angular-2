import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Item} from "./item";
import {AuthService} from "./auth.service";
import {ItemService} from "./item.service";

@Component({
    selector: "item-detail-view",
    template: `
<div *ngIf="item">
    <h2>
        <a href="javascript:void(0)" (click)="onBack()">&laquo; Back to Home</a>
    </h2>
    <div class="item-container">
        <ul class="nav nav-tabs">
            <li *ngIf="authService.isLoggedIn()" role="presentation">
                <a href="javascript:void(0)" (click)="onItemDetailEdit(item)">Edit</a>
            </li>
            <li role="presentation" class="active">
                <a href="javascript:void(0)">View</a>
            </li>
        </ul>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="item-image-panel">
                    <img src="/img/item-image-sample.png" alt="{{item.Title}}" />
                    <div class="caption">Sample image with caption.</div>
                </div>
                <h3>{{item.Title}}</h3>
                <p>{{item.Description}}</p>
                <p>{{item.Text}}</p>
            </div>
        </div>
    </div>
</div>
    `,
    styles: []
})

export class ItemDetailViewComponent {
    item: Item;

    constructor(
        private authService: AuthService,
        private itemService: ItemService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        var id = +this.activatedRoute.snapshot.params["id"];
        if (id) {
            this.itemService.get(id).subscribe(
                item => this.item = item
            );
        }
        else if (id === 0) {
            console.log("id is 0: switching to edit mode...");
            this.router.navigate(["item/edit", 0]);
        }
        else {
            console.log("Invalid id: routing back to home...");
            this.router.navigate([""]);
        }
    }

    onItemDetailEdit(item: Item) {
        this.router.navigate(["item/edit", item.Id]);
        return false;
    }

    onBack() {
        this.router.navigate(['']);
    }
}
