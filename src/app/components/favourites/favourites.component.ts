import {Component, OnInit} from '@angular/core';
import {FavouriteService} from '../../services/favourite.service';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IRepo} from '../../interfaces/repo.interface';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  public favouriteItems$: Observable<IRepo[]>;

  constructor(
    private favouriteService: FavouriteService
  ) {
  }

  ngOnInit() {
    this.favouriteService.favouriteItems$.pipe(take(1)).subscribe();
    this.favouriteItems$ = this.favouriteService.favouriteItems$;
  }

  removeFavourite(id: number): void {
    this.favouriteService.removeFavourite(id);
  }
}
