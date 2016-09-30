import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Item} from "./item";
import {ItemService} from "./item.service";

@Component({
    selector: "item-detail-edit",
    template: `
<div *ngIf="item">
    <h2>
        <a href="javascript:void(0)" (click)="onBack()">
            &laquo; Back to Home
        </a>
    </h2>
    <div class="item-container">
        <ul class="nav nav-tabs">
            <li role="presentation" class="active">
                <a href="javascript:void(0)">Edit</a>
            </li>
            <li role="presentation" *ngIf="item.Id != 0">
                <a href="javascript:void(0)" (click)="onItemDetailView(item)">View</a>
            </li>
        </ul>
        <div class="panel panel-default">
            <div class="panel-body">
                <form class="item-detail-edit" #thisForm="ngForm">
                    <h3>
                        {{item.Title}}
                        <span class="empty-field" [hidden]="dTitle.valid">
                            Empty Title
                        </span>
                    </h3>
                    <div class="form-group has-feedback" [ngClass]="{'has-success': dTitle.valid, 'has-error': !dTitle.valid}">
                        <label for="input-title">Title</label>
                        <input id="input-title" name="input-title" type="text" class="form-control" [(ngModel)]="item.Title" placeholder="Insert the title..." required #dTitle="ngModel" />
                        <span class="glyphicon form-control-feedback" aria-hidden="true" [ngClass]="{'glyphicon-ok': dTitle.valid, 'glyphicon-remove': !dTitle.valid}"></span>
                        <div [hidden]="dTitle.valid" class="alert alert-danger">
                            You need to enter a valid Title.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="input-description">Description</label>
                        <textarea id="input-description" name="input-description" class="form-control" [(ngModel)]="item.Description" placeholder="Insert a suitable description..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="input-text">Text</label>
                        <textarea id="input-text" name="input-text" class="form-control" [(ngModel)]="item.Text" placeholder="Insert a suitable description..."></textarea>
                    </div>
                    <div *ngIf="item.Id == 0" class="commands insert">
                        <input type="button" class="btn btn-primary" value="Save" (click)="onInsert(item)" />
                        <input type="button" class="btn btn-default" value="Cancel" (click)="onBack()" />
                    </div>
                    <div *ngIf="item.Id != 0" class="commands update">
                        <input type="button" class="btn btn-primary" value="Update" (click)="onUpdate(item)" />
                        <input type="button" class="btn btn-danger" value="Delete" (click)="onDelete(item)" />
                        <input type="button" class="btn btn-default" value="Cancel" (click)="onItemDetailView(item)" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
    `,
    styles: []
})

export class ItemDetailEditComponent {
    item: Item;

    constructor(private itemService: ItemService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        var id = +this.activatedRoute.snapshot.params["id"];
        if (id) {
            this.itemService.get(id).subscribe(
                item => this.item = item
            );
        }
        else if (id === 0) {
            console.log("id is 0: adding a new item...");
            this.item = new Item(0, "New Item", null);
        }
        else {
            console.log("Invalid id: routing back to home...");
            this.router.navigate([""]);
        }
    }

    onInsert(item: Item) {
        this.itemService.add(item).subscribe(
            (data) => {
                this.item = data;
                console.log("Item " + this.item.Id + " has been added.");
                this.router.navigate([""]);
            },
            (error) => console.log(error)
        );
    }

    onUpdate(item: Item) {
        this.itemService.update(item).subscribe(
            (data) => {
                this.item = data;
                console.log("Item " + this.item.Id + " has been updated.");
                this.router.navigate(["item/view", this.item.Id]);
            },
            (error) => console.log(error)
        );
    }

    onDelete(item: Item) {
        var id = item.Id;
        this.itemService.delete(id).subscribe(
            (data) => {
                console.log("Item " + id + " has been deleted.");
                this.router.navigate([""]);
            },
            (error) => console.log(error)
        );
    }

    onBack() {
        this.router.navigate([""]);
    }

    onItemDetailView(item: Item) {
        this.router.navigate(["item/view", item.Id]);
    }
}
