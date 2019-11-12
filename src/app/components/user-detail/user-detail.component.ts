import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {skipWhile, switchMap, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GithubService} from '../../services/github.service';
import {DialogComponent} from '../dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {FavouriteService} from '../../services/favourite.service';
import {IUser} from '../../interfaces/user.interface';
import {IRepo} from '../../interfaces/repo.interface';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  public user$: Observable<IUser>;
  public userName: string;

  constructor(
    public favouriteService: FavouriteService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private gitHubService: GithubService
  ) {
  }

  ngOnInit() {
    this.user$ = this.gitHubService.user$;

    this.route.params
      .pipe(
        skipWhile(login => !login),
        switchMap((params) => {
          this.userName = params.id;
          return this.gitHubService.getUser(params.id);
        }),
        take(1)
      )
      .subscribe();
  }

  public openDialog(repo: IRepo): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      height: '250px',
      data: {...repo}
    });

    dialogRef.afterClosed().subscribe();
  }

  public addToFavourite(repo: IRepo): void {
    const isExist = this.favouriteService.getFavourites().filter((store: IRepo) => store.id === repo.id);
    if (isExist.length) {
      this.favouriteService.removeFavourite(repo.id);
      repo.inFavourite = false;
      return;
    }
    repo.inFavourite = true;
    this.favouriteService.addToFavourite(repo);
  }

  public repoInFavourite(repo: IRepo): void {
    this.favouriteService.getFavourites().filter((fav: IRepo) => {
      if (fav.id === repo.id) {
        repo.inFavourite = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.gitHubService.setUser(null);
  }

}
