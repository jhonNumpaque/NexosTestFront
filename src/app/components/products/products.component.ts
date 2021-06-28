import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { DataService } from 'src/app/services/data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSave, faTrash, faEdit, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/services/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[];
  product: Product;
  userId: string;
  id: number;
  userModify: number;
  subscription: Subscription;
  faSave = faSave;
  faEdit = faEdit;
  faTrash = faTrash;
  faFilter = faFilter;
  showAlert = false;
  
  productForm:FormGroup;
  filter: String;

  constructor(
    private serviceProduct: ProductsService,
    private fb: FormBuilder,
    private dataService: DataService,
    public toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadDataService();
    this.gettingProducts();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      admissionDate: ['', Validators.required]
    });
  }

  loadDataService():void {
    this.subscription = this.dataService.currentValue.subscribe(userId => this.userId = userId);
  }

  gettingProducts(): void {
    this.serviceProduct.sendRequestForGettingProducts().pipe(takeUntil(this.destroy$)).subscribe((data: Product[]) => { this.products = data; });
  }

  gettingDataProduct(id: number) {
    this.serviceProduct.sendRequestForGettingProductById(id).pipe(takeUntil(this.destroy$)).subscribe((data: Product) => { this.product = data });
  }

  saveDataProduct(user: any): void {
    this.serviceProduct.sendRequestForSaveProduct(user).pipe(takeUntil(this.destroy$)).subscribe((data: any) => { this.gettingProducts(); })
  }  

  deleteProduct(id: number): void {
    this.serviceProduct.sendRequestForGettingProductById(id).pipe(takeUntil(this.destroy$)).subscribe((data: Product) => {
      if (this.userId == data.userRecord.toString()) {
        this.serviceProduct.sendRequestForDeletingProductById(id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => { 
          this.gettingProducts(); 
          this.toastService.show("Alerta", "El producto se ha eliminado exitosamente", "bg-warning text-light");
        })          
      } else {
        this.toastService.show("Error", "El usuario no es el mismo que registro el producto", "bg-danger text-light");
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.subscription.unsubscribe();
  }

  onSubmit(): void {  
    if (this.userId == undefined || this.userId == "0") {
      this.toastService.show("Error", "El usuario no puede ser vacio", "bg-danger text-light");
      return;
    }

    if (this.productForm.valid) {
      if (this.id != null) {
        this.serviceProduct.sendRequestForUpdateProduct({
          id: this.id,
          name: this.productForm.value.name,
          quantity: this.productForm.value.quantity,
          updatedAt: moment(new Date()).toISOString(),
          userUpdate: this.userId
        }, this.id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => { this.gettingProducts(); })
        this.toastService.show("Alerta", "El producto se ha modificado exitosamente", "bg-warning text-light");        
      } else {
        this.saveDataProduct({
          name: this.productForm.value.name,
          quantity: this.productForm.value.quantity,
          admissionDate: this.productForm.value.admissionDate.toString(),
          userRecord: this.userId
        });
    
        this.toastService.show("Alerta", "El producto se ha guardado exitosamente", "bg-success text-light");
      }
    }
  }


  gettingDataUser(id: number): void {
    this.serviceProduct.sendRequestForGettingProductById(id).pipe(takeUntil(this.destroy$)).subscribe((data: Product) => {
      this.id = id;
      this.userModify = data.userRecord;
      this.productForm.setValue({
        name: data.name,
        quantity: data.quantity,
        admissionDate: data.admissionDate
      });
    })
  }

  get f(){
    return this.productForm.controls;
  }

  changeDate(event) {
    if (!(moment(event.target.value).toDate() <= new Date())) {
      this.toastService.show("Error", "La fecha no puede ser mayor al día de hoy", "bg-danger text-light");
      return;
    }  
  }

  gettingFilter(event) {
    this.filter = event.target.value;
  }

  onReset() {
    this.productForm.reset();
  }

  filterTable(value): void {
    if (this.filter == null && this.filter == "") {      
      this.toastService.show("Error", "El filtro no puede ser vacio", "bg-danger text-light");
    } else {
      switch(this.filter) {
        case "Fecha": 
          this.serviceProduct.sendRequestForGettingProducts().pipe(takeUntil(this.destroy$)).subscribe((data: Product[]) => { 
            this.products = data.filter(x => x.admissionDate == value);
          });
          break;
        case "Nombre": 
          this.serviceProduct.sendRequestForGettingProducts().pipe(takeUntil(this.destroy$)).subscribe((data: Product[]) => { 
            this.products = data.filter(x => x.name == value);
          });          
          break;
        default: this.gettingProducts(); break;
      }
    }
  }
}
