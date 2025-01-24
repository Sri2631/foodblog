// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

// @Component({
//   selector: 'app-post-form',
//   templateUrl: './post-form.component.html',
//   styleUrls: ['./post-form.component.scss'],
// })
// export class PostFormComponent implements OnInit {
//   postForm: FormGroup;
//   previewImage: string | ArrayBuffer | null = null;

//   constructor(private fb: FormBuilder) {
//     this.postForm = this.fb.group({
//       title: [''],
//       image: [''],
//       ingredients: this.fb.array([]),
//       cookingTime: [''],
//       description: [''],
//     });
//   }

//   ngOnInit(): void {}

//   onFileChange(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.previewImage = reader.result; // Preview the image
//         this.postForm.get('image')?.setValue(this.previewImage); // Optionally, store the Base64 in the form
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   addIngredient(): void {
//     (this.postForm.get('ingredients') as FormArray).push(this.fb.control(''));
//   }

//   onSubmit(): void {
//     console.log(this.postForm.value);
//     // Post data to the backend
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  postForm!: FormGroup ;
  isEdit: boolean = false;
  postId!: number;
 
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      cookingTime: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
      ingredients: this.fb.array([]) // FormArray for ingredients
    });

    // Check if editing an existing post
    this.postId = +this.route.snapshot.paramMap.get('id')!;
    if (this.postId) {
      this.isEdit = true;
      this.loadPost();
    }
  }

  // Get ingredients FormArray
  get ingredients(): FormArray {
    return this.postForm.get('ingredients') as FormArray;
  }

  // Add an ingredient input field
  addIngredient(): void {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  // Remove an ingredient input field
  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  // Load existing post data if editing
  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (post: Post) => {
        this.postForm.patchValue({
          title: post.title,
          description: post.description,
          cookingTime: post.cookingTime,
          image: post.image
        });
        post.ingredients.forEach(ingredient => this.ingredients.push(this.fb.control(ingredient)));
      },
      error: (error) => {
        console.error('Failed to load post:', error);
        alert('Unable to load the post. Please try again.');
        this.router.navigate(['/']);
      }
    });
  }

  // Submit the form
  onSubmit(): void {
    if (this.postForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const post: Post = this.postForm.value;

    if (this.isEdit) {
      this.postService.updatePost(this.postId, post).subscribe({
        next: () => {
          alert('Post updated successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Failed to update post:', error);
          alert('Failed to update the post. Please try again.');
        }
      });
    } else {
      this.postService.createPost(post).subscribe({
        next: () => {
          alert('Post created successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Failed to create post:', error);
          alert('Failed to create the post. Please try again.');
        }
      });
    }
  }
}
