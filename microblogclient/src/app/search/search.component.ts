import { Component, OnInit } from '@angular/core';
import { User } from '../types/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private userService: UserService) { }

  users: User[] = [
    {
        "id": 3,
        "username": "marcelino",
        "first_name": "",
        "last_name": "",
        "email": ""
    },
    {
        "id": 4,
        "username": "medusa",
        "first_name": "Stefani",
        "last_name": "dlugokens campos",
        "email": "medusadlugo@gmail.com"
    }
]

  ngOnInit(): void {
    this.getSearchResults()
  }

  getSearchResults(){
    return this.userService.getSearchUsers('s').subscribe(res => {
      console.log(res)
    });
  }
}
