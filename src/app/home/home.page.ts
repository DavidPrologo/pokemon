import { Component, inject, OnInit } from '@angular/core';
import { RefresherCustomEvent, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonNote, IonInfiniteScrollContent, IonInfiniteScroll } from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import { IonicModule, NavController } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [  
    NgxPaginationModule, 
    // IonLabel, 
    // IonItem, 
    // IonHeader, 
    // IonToolbar, 
    // IonTitle, 
    // IonContent, 
    // IonList, 
    CommonModule,
    IonicModule,
  ],
})
export class HomePage implements OnInit {
  data!: Pokemon[];
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    public navCtrl: NavController, 
    private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPokemon( this.pageIndex, this.pageSize );
  }

  onPageChange( pageIndex: number ): void {
    const pageSize = this.getResponsiveLimit();
    this.fetchPokemon( pageIndex, pageSize);
  }


  fetchPokemon( pageIndex: number, pageSize: number ): void {
    this.http.get<any>(`https://pokeapi.co/api/v2/ability/?limit=${pageSize}&offset=${pageIndex * pageSize}`)
    .subscribe( data => {
          this.data = data.results.map((pokemon: Pokemon) => {
            const urlParts = pokemon.url.split('/');
            pokemon.id = parseInt(urlParts[urlParts.length - 2], 10);
            return pokemon;
        })
    });
  }

  openDetalhe(pokemonId?: number) {
    this.navCtrl.navigateForward('/detalhe', {
      queryParams: { id: pokemonId }
    });
  }

  getResponsiveLimit(): number {
    const width = window.innerWidth;

    if (width < 576) return 5;       // Mobile
    if (width < 768) return 10;      // Tablet
    if (width < 992) return 15;      // Small desktop
    return 20;                       // Large screens
  }

}

interface Pokemon {
  name: string,
  url: string
  id?: number,
}