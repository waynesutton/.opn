export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  markdownFile: string;
}

export interface PostsData {
  posts: PostMetadata[];
}

