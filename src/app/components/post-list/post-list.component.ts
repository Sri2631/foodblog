import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = []; // List of posts
  loading: boolean = false; // To show a loading spinner
  errorMessage: string = ''; // Error message for UI feedback

  constructor(private postService: PostService ,private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // Load posts from the service
  loadPosts(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load posts. Please try again later.';
        console.error(error);
        this.loading = false;
      }
    });
  }
  // Delete a post
  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id);
          alert('Post deleted successfully!');
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete the post. Please try again later.';
          console.error(error);
        }
      });
    }
  }
}

