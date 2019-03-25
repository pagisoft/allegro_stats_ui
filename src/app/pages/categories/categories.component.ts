import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  selectedFirstLevelCategory;
  selectedRootCategory;
  selectedSecondLevelCategory;
  rootCategories: Observable<Array<any>>;
  firstLevelCategories: Observable<Array<any>>;
  secondLevelCategories: Observable<Array<any>>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.rootCategories = this.http.get<Array<any>>('http://localhost:8080/categories/root');
  };

  rootCategorySelected(event) {
    this.selectedFirstLevelCategory = null;
    this.firstLevelCategories = this.http.get<Array<any>>('http://localhost:8080/categories/' + event.value.id);
  }

  firstLevelCategorySelected(event) {
    console.log(this.selectedFirstLevelCategory);
    this.selectedSecondLevelCategory = null;
    this.secondLevelCategories = this.http.get<Array<any>>('http://localhost:8080/categories/' + event.value.id);
  }

  secondLevelCategorySelected(event) {

  }

  clear() {
    this.selectedRootCategory = null;
    this.selectedFirstLevelCategory = null;
    this.selectedSecondLevelCategory = null;
  }

  showSubCategory(selectedParentCategory) {
    if (selectedParentCategory && selectedParentCategory.id > 0 && !selectedParentCategory.leaf) {
      return true;
    }
    return false;
  }

  lock() {}
}
