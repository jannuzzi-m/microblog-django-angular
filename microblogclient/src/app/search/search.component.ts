import { Component, OnInit } from '@angular/core';
import { User } from '../types/User';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from '../types/Profile';
import { API_ROOT, API_PATHS, DEFAULTICONPATH } from '../consts';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private userService: UserService, private route: Router) { }

  searchParams = new FormGroup({
    search: new FormControl('')
  }

  )

  profiles: Profile[] = []

  usersEmpty() {
    return this.profiles.length == 0
  }

  ngOnInit(): void {
    this.getSearchResults()
  }

  getSearchResults() {
    return this.userService.getSearchUsers('s').subscribe(res => {
      // console.log(res)
    });
  }

  search() {
    const keywords = this.searchParams.value.search;
    console.log(keywords)
    return this.userService.getSearchUsers(keywords).subscribe(res => {
      res.map((r: Profile) => r.icon = r.icon ? r.icon: DEFAULTICONPATH)
      this.profiles = res
    
      


      console.log(res)
    })
  }

  goToUser(id:number){
    this.route.navigate([`user/${id}`])
  }
}
