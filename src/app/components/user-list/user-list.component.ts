import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from '../../services/github.service';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, take} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {IUser} from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  public users$: Observable<IUser[]>;
  public searchString: FormControl = new FormControl('');
  private searchStringSubscription: Subscription;

  constructor(
    private gitHubService: GithubService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.gitHubService.getUsers().pipe(take(1)).subscribe();
    this.users$ = this.gitHubService.users$;

    this.searchStringSubscription = this.searchString.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(username => this.gitHubService.searchByUser(username))
      ).subscribe();
  }

  public goUserDetail(login: string): void {
    this.router.navigate(['/repos', login]);
  }

  ngOnDestroy(): void {
    this.searchStringSubscription.unsubscribe();
  }

}
