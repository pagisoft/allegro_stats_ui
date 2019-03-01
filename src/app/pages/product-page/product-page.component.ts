import {Component, HostBinding, OnInit} from '@angular/core';
import {routerAnimation} from '../../utils/page.animation';
import {tdCollapseAnimation, tdFadeInOutAnimation} from '@covalent/core/common';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  animations: [routerAnimation, tdCollapseAnimation, tdFadeInOutAnimation]
})
export class ProductPageComponent implements OnInit {
  // Add router animation
  @HostBinding('@routerAnimation') routerAnimation = true;
  // Product item to show
  selectedItem = {
    name: 'HEADPHONES',
    price: 29.99,
    code: 'QR199PK',
    color: 'Pink',
    quantity: 1,
    image: 'assets/products/600600.png',
    size: 'Medium'
  };
  // Some addition order parameters
  availableColors = ['Pink', 'Blue', 'White'];
  availableSizes = ['Small', 'Medium', 'Large'];
  // Flag to open/close additional sections
  detailsOpen = false;
  reviewsOpen = false;
  shippingOpen = true;

  constructor() {
  }

  ngOnInit() {
  }

}
