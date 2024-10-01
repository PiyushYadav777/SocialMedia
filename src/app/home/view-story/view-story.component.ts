import { Component, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { ApiService } from 'src/app/Services/api.service';
import { HelperService } from 'src/app/Services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-story',
  templateUrl: './view-story.component.html',
  styleUrls: ['./view-story.component.scss']
})
export class ViewStoryComponent implements OnInit {
  stories: any[] = [];
  loading: boolean = true;
  FILE_URL = environment.FILE_URL;
  userId!: number;
  selectedStory: any = null;
  popupTimeout: any;
  currentIndex: number = 0;
  // popupInterval: any;
  storyInterval: any;

  constructor(private apiService: ApiService, private helperService: HelperService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('User');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.userId = parsedUserData.user_id;
      this.loadStories();
    } else {
      this.helperService.error('User data not found.');
    }
  }

  loadStories(): void {
    let obj = {
      user_id: this.userId
    };
    this.apiService.postData('view_story', obj).subscribe({
      next: (response: any) => {
        if (response.status == '1') {
          this.stories = response.data;
        } 
        this.loading = false;
      },
      error: () => {
        this.helperService.error('Error fetching stories. Please try again.');
        this.loading = false;
      }
    });
  }

  openPopup(story: any): void {
    this.selectedStory = story.stories;
    this.currentIndex = 0;
    this.startStoryCycle();
  }


  startStoryCycle(): void {
    this.showCurrentStory();

    this.storyInterval = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.selectedStory.length) {
        this.closePopup();
      } else {
        this.showCurrentStory();
      }
    }, 5000); 
  }

  showCurrentStory(): void {  }

  closePopup(): void {
    this.selectedStory = null;
    clearInterval(this.storyInterval); 
    // this.selectedStory = [];
  }

  ngOnDestroy(): void {
    clearInterval(this.storyInterval); 
  }

  getCurrentStory() {
    return this.selectedStory ? this.selectedStory : [];
  }
  
  getUserName(): string {
    if (this.selectedStory && this.selectedStory.length > 0) {
      const currentStory = this.selectedStory[this.currentIndex];
      const user = this.stories.find(story => story.stories.includes(currentStory));
      return user ? `${user.first_name} ${user.last_name}` : '';
    }
    return '';
  }

}






