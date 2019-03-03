import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  getCategories() {
    return this.httpClient.get('http://localhost:8080/categories');
  }

}
