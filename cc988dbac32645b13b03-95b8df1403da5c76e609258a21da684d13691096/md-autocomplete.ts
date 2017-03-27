import {Component, Input, OnInit, Output, EventEmitter} from "angular2/core";
import {MdList, MdListItem, MdInput, MdInputContainer} from "ng2-material/all";

@Component({
    selector: "md-autocomplete",
    directives: <Array<any>>[MdList, MdListItem, MdInput, MdInputContainer],
    template: `
    <md-input-container>
      <label>{{placeholder}}</label>
      <input md-input type="search"
        (focus)="onEnter()"
        (blur)="onLeave()"
        (keyup)= "onKeyUp($event)"
        [(ngModel)] = "searchText"
        placeholder="{{placeholder}}"
        required="{{required}}"/>

    </md-input-container>
    <!--todo - define as content child-->
    <div class="md-whiteframe-z1 md-autocomplete-list" *ngIf="popupVisible">
    <ul class="md-autocomplete-suggestions">
      <li *ngFor= "#item of matches" (mousedown)="select(item)">
        <p>{{item[itemText]}}</p>
        <md-divider></md-divider>
      </li>
    </ul>
    </div>
    <ng-content></ng-content>`,
})
export class MdAutocomplete implements OnInit {
    @Input()
    placeholder:string;

    @Input()
    required:boolean = false;

    @Input()
    items = [];

    @Input()
    itemText:string;

    @Input()
    getMatches:Function;

    @Input()
    selectedItem;

    @Output()
    selectedItemChange = new EventEmitter();

    @Input()
    searchText:string;

    @Output()
    searchTextChange = new EventEmitter();

    popupVisible = false;

    private matches = [];

    ngOnInit() {
        this.setMatches();
    }

    onEnter() {
        this.setMatches();
        this.popupVisible = true;
    }

    onLeave() {
        this.popupVisible = false;
    }

    //[(value)] is buggy and does not propagate changes on the md-input so we can get the value correctly
    onKeyUp(event) {
        this.searchText = event.target.value;
        this.searchTextChange.emit(this.searchText);

        this.setMatches();
    }

    select(item) {
        this.selectedItemChange.emit(item);
        this.searchText = item[this.itemText];
        this.popupVisible = false;
    }

    private setMatches() {
        if (this.searchText) {
            this.matches = this.getMatches(this.items, this.searchText, this.itemText);

        } else {
            this.matches = this.items;
        }
    }
}