# Testing OPN Blog Features

This is another test post to verify the blog functionality works correctly.

## What We're Testing

1. Multiple blog posts
2. Markdown rendering
3. Date formatting
4. Excerpt display
5. Navigation

## Code Example

Here's a TypeScript example:

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  markdownFile: string;
}

const post: BlogPost = {
  slug: 'testing-opn-blog',
  title: 'Testing OPN Blog Features',
  date: '2025-01-20',
  excerpt: 'Exploring the new blog post features in OPN.',
  markdownFile: 'testing-opn-blog.md'
};
```

## Conclusion

The blog feature is working great! You can now write blog posts in Markdown and they'll be automatically rendered on your OPN profile.

