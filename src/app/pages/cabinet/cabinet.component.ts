import { Component } from '@angular/core';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent {

  public active!: boolean;
  public activeTitle!: boolean;
  public activeList!: boolean;
  public activePage = 'Особисті дані';
  constructor(

  ){}

  change():void{
    this.activeTitle = !this.activeTitle;
    this.activeList = !this.activeList;
  }


  selectName(page: string):void{
    this.activePage = page;
  }


}
