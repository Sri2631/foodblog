export interface Post {
    id: number; // Unique identifier for the post
    title: string; // Title of the recipe
    image: string; // URL for the recipe image
    ingredients: string[]; // List of ingredients
    cookingTime: number; // Time required to cook (in minutes)
    description: string; // Description of the recipe
  }