import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  post!: Post;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPost(postId);
  }

  // Fetch post details
  loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (data: Post) => {
        this.post = data;
      },
      error: (error) => {
        console.error('Failed to load post:', error);
        alert('Unable to fetch post details.');
        this.router.navigate(['/']);
      }
    });
  }
}

