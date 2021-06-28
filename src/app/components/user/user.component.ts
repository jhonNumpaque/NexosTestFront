import { Component, OnDestroy, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { RolesService } from 'src/app/services/roles.service';
import { faPlusCircle, faCalendar, faSave } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  faPlusCircle = faPlusCircle;
  faCalendar = faCalendar;
  faSave = faSave;
  name:string;
  age:number = 0;
  role:any = '';
  admissionDate:any = '';
  saveUser: boolean = false;

  roles: Role[];
  users: User[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscription: Subscription;

  userId: string;
  constructor(
    private roleService: RolesService, 
    private userService: UsersService,
    private dataService: DataService,
    public toastService: ToastService
  ) { 
  }

  ngOnInit(): void {
    this.gettingRoles();
    this.gettingUsers();
    this.subscription = this.dataService.currentValue.subscribe(userId => this.userId = userId);
  }

  gettingRoles(): void {
    this.roleService.sendRequestForGettingRoles().pipe(takeUntil(this.destroy$)).subscribe((data: Role[]) => { this.roles = data });
  }

  gettingUsers(): void {
    this.userService.sendRequestForGettingUsers().pipe(takeUntil(this.destroy$)).subscribe((data: User[]) => { this.users = data }); 
  }

  saveUserData(user: any): void {
    this.userService.sendRequestForSavingUser(user).pipe(takeUntil(this.destroy$)).subscribe((data) => { 
      this.toastService.show("Alerta", "El usuario guardado exitosamente", "bg-success text-light");
      this.gettingUsers(); 
    }); 
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.subscription.unsubscribe();
  }

  open() {
    this.saveUser = true;
  }

  selectChange(event: any) {
    this.role = event.target.value;
  }

  selectChangeUser(event: any) {
    this.userId = event.target.value;
    this.dataService.changeMessage(this.userId);  
  }

  saveData() {
    const user: any = {      
      names: this.name,
      age: this.age,
      admissionDate: this.admissionDate,
      role: Number(this.role)
    };
    this.saveUserData(user);
    this.saveUser = false;
  }
}
