## `bio.json` Schema

Your `bio.json` file defines what appears on your OPN profile. Below is a breakdown of its structure and how to use each part.

### Top-Level Fields

| Field         | Type   | Required | Description                                |
| ------------- | ------ | -------- | ------------------------------------------ |
| `name`        | string | ✅       | Your full name (or display name).          |
| `description` | string | ✅       | A short tagline or summary of who you are. |
| `sections`    | array  | ❌       | Optional content blocks for your profile.  |
| `style`       | object | ❌       | Customize font and theme (light/dark).     |

---

### Sections

The `sections` field is an array of content blocks. Each block must be one of the following `type`s:

#### 1. **List Section**

Displays a list of items, such as work experience, projects, publications, etc.

```json
{
  "title": "Projects",
  "type": "list",
  "items": [
    {
      "title": "Project One",
      "description": "An open-source project.",
      "url": "https://github.com/yourname/one",
      "date": "2025"
    }
  ]
}
```

| Field                 | Type   | Required | Description                      |
| --------------------- | ------ | -------- | -------------------------------- |
| `title`               | string | ✅       | Section title (e.g. "Projects"). |
| `type`                | string | ✅       | Must be `"list"`.                |
| `items`               | array  | ✅       | List of entries in the section.  |
| `items[].title`       | string | ✅       | Title of the entry.              |
| `items[].description` | string | ❌       | Short description.               |
| `items[].url`         | string | ❌       | Optional link.                   |
| `items[].date`        | string | ❌       | Optional date (e.g. year).       |

---

#### 2. **Text Section**

Displays a block of plain textn.

```json
{
  "title": "About Me",
  "type": "text",
  "content": "I'm a developer who loves building open tools for the web."
}
```

| Field     | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `title`   | string | ✅       | Section title.    |
| `type`    | string | ✅       | Must be `"text"`. |
| `content` | string | ✅       | The text content. |

---

#### 3. **Links Section**

Displays a group of external links, like social media or portfolios.

```json
{
  "title": "Connect",
  "type": "links",
  "links": [
    {
      "title": "GitHub",
      "url": "https://github.com/yourname"
    }
  ]
}
```

| Field           | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| `title`         | string | ✅       | Section title.       |
| `type`          | string | ✅       | Must be `"links"`.   |
| `links`         | array  | ✅       | List of links.       |
| `links[].title` | string | ✅       | Label for the link.  |
| `links[].url`   | string | ✅       | The URL of the link. |

---

#### 4. **GitViews Section**

Displays GitHub view counter badges from [GitViews](https://gitviews.com). You can show profile views, repository views, or all repositories views.

```json
{
  "title": "GitHub Stats",
  "type": "gitviews",
  "profileViews": true,
  "repoViews": [
    {
      "username": "your-username",
      "repo": ".opn"
    }
  ],
  "allReposViews": true,
  "style": "flat-square",
  "labelColor": "#000",
  "color": "#007acc"
}
```

| Field                    | Type    | Required | Description                                                                 |
| ------------------------ | ------- | -------- | --------------------------------------------------------------------------- |
| `title`                  | string  | ✅       | Section title.                                                              |
| `type`                   | string  | ✅       | Must be `"gitviews"`.                                                       |
| `profileViews`           | boolean | ❌       | Show profile view badge (uses your GitHub username).                        |
| `repoViews`              | array   | ❌       | List of repositories to show view badges for.                               |
| `repoViews[].username`   | string  | ✅       | GitHub username (can be different from your profile username).              |
| `repoViews[].repo`       | string  | ✅       | Repository name.                                                            |
| `allReposViews`          | boolean | ❌       | Show all repositories view badge (uses your GitHub username).                |
| `style`                  | string  | ❌       | Badge style: `"flat"`, `"flat-square"`, `"for-the-badge"`, `"social"`, `"plastic"`. Default: `"flat"`. |
| `labelColor`             | string  | ❌       | Badge label background color (hex, rgb, or color name).                     |
| `color`                  | string  | ❌       | Badge value color (hex, rgb, or color name).                                |

---

### Style (Optional)

Customize your profile’s appearance.

```json
"style": {
  "font": "serif",
  "theme": "dark"
}
```

| Field   | Type   | Options                   | Description           |
| ------- | ------ | ------------------------- | --------------------- |
| `font`  | string | `"serif"`, `"sans-serif"` | Choose a font style.  |
| `theme` | string | `"light"`, `"dark"`       | Choose a color theme. |

---

## Blog Posts

OPN supports blog posts stored in your `.opn` repository. Blog posts are accessible at:

```
https://opn.bio/@<your-github-username>/<post-slug>
```

### Setup

1. Create a `posts.json` file in your `.opn` repository root.
2. Create a `posts/` folder in your `.opn` repository.
3. Add markdown files for each blog post in the `posts/` folder.

### `posts.json` Schema

```json
{
  "posts": [
    {
      "slug": "my-first-post",
      "title": "My First Blog Post",
      "date": "2025-01-15",
      "excerpt": "This is a short description of my first blog post.",
      "markdownFile": "my-first-post.md"
    }
  ]
}
```

| Field          | Type   | Required | Description                                    |
| -------------- | ------ | -------- | ---------------------------------------------- |
| `posts`        | array  | ✅       | Array of blog post metadata.                   |
| `posts[].slug` | string | ✅       | URL-friendly identifier (used in the URL).      |
| `posts[].title` | string | ✅       | Blog post title.                                |
| `posts[].date` | string | ✅       | Publication date (ISO format: YYYY-MM-DD).     |
| `posts[].excerpt` | string | ❌       | Short description shown on the blog post page. |
| `posts[].markdownFile` | string | ✅       | Filename of the markdown file in the `posts/` folder. |

### Markdown Files

- Store markdown files in the `posts/` folder within your `.opn` repository.
- Use standard Markdown syntax.
- The filename must match the `markdownFile` field in `posts.json`.
- Files are fetched from the `main` or `master` branch automatically.

### Example Structure

```
.opn/
├── bio.json
├── posts.json
└── posts/
    ├── my-first-post.md
    └── another-post.md
```

### Accessing Blog Posts

Once set up, your blog posts will be available at:

- `https://opn.bio/@your-username/my-first-post`
- `https://opn.bio/@your-username/another-post`

You can link to these URLs from your `bio.json` using a Links section or add them manually to any section.
