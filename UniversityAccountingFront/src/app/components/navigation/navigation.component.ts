import { BottomNavigationSelectEvent } from "@progress/kendo-angular-navigation";
import { Data, Route, Router } from "@angular/router";
import { Component } from "@angular/core";

export interface CustomRoute extends Route {
  text?: string;
  svgIcon?: string;
  selected?: boolean;
  path?: string;
  data?: Data;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})

export class NavigationComponent {
  public items : CustomRoute[];

  constructor(private router: Router) {
    this.items = this.mapItems(router.config);
   
    const defaultRedirectRouteIndex = 0;
    this.items.splice(defaultRedirectRouteIndex, 1);

    this.items[0].selected = true;
  }

  public onSelect(ev: BottomNavigationSelectEvent): void {
    this.router.navigate([ev.item.path]);
  }

  public mapItems(routes: CustomRoute[]): CustomRoute[] {
    return routes.map((item) => {
      return {
        text: item.data ? item.data!['text'] : "",
        svgIcon: item.svgIcon,
        path: item.path ? item.path : "",
      };
    });
  }
}
