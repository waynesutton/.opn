import type { PostMetadata, PostsData } from '@/types/posts';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const isDev = import.meta.env.DEV;

// Get the project root directory (process.cwd() returns the project root in Astro)
const projectRoot = process.cwd();

function getPostsJsonUrl(username: string, branch: string) {
  return `https://raw.githubusercontent.com/${username}/.opn/refs/heads/${branch}/posts.json`;
}

function getPostMarkdownUrl(username: string, branch: string, filename: string) {
  return `https://raw.githubusercontent.com/${username}/.opn/refs/heads/${branch}/posts/${filename}`;
}

async function fetchLocalPosts(): Promise<PostsData | null> {
  if (!isDev) return null;
  
  try {
    // In dev mode, read from local file system
    const postsJsonPath = join(projectRoot, 'posts.json');
    const content = readFileSync(postsJsonPath, 'utf-8');
    return JSON.parse(content) as PostsData;
  } catch {
    // Ignore errors, fall back to GitHub
    return null;
  }
}

async function fetchLocalPostMarkdown(filename: string): Promise<string | null> {
  if (!isDev) return null;
  
  try {
    // In dev mode, read from local file system
    const markdownPath = join(projectRoot, 'posts', filename);
    return readFileSync(markdownPath, 'utf-8');
  } catch {
    // Ignore errors, fall back to GitHub
    return null;
  }
}

async function fetchPostsJson(username: string, branch: string) {
  const url = getPostsJsonUrl(username, branch);
  const res = await fetch(url);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data as PostsData;
}

export async function getPosts(username: string): Promise<PostsData | null> {
  // In development, try local files first
  if (isDev) {
    const local = await fetchLocalPosts();
    if (local) {
      return local;
    }
  }

  const main = await fetchPostsJson(username, 'main');

  if (main) {
    return main;
  }

  const master = await fetchPostsJson(username, 'master');

  return master || null;
}

export async function getPostMarkdown(
  username: string,
  filename: string,
): Promise<string | null> {
  // In development, try local files first
  if (isDev) {
    const local = await fetchLocalPostMarkdown(filename);
    if (local) {
      return local;
    }
  }

  const mainUrl = getPostMarkdownUrl(username, 'main', filename);
  const mainRes = await fetch(mainUrl);

  if (mainRes.ok) {
    return await mainRes.text();
  }

  const masterUrl = getPostMarkdownUrl(username, 'master', filename);
  const masterRes = await fetch(masterUrl);

  if (masterRes.ok) {
    return await masterRes.text();
  }

  return null;
}

export async function getPostBySlug(
  username: string,
  slug: string,
): Promise<{ metadata: PostMetadata; content: string } | null> {
  const postsData = await getPosts(username);

  if (!postsData || !postsData.posts) {
    return null;
  }

  const post = postsData.posts.find(p => p.slug === slug);

  if (!post) {
    return null;
  }

  const content = await getPostMarkdown(username, post.markdownFile);

  if (!content) {
    return null;
  }

  return {
    metadata: post,
    content,
  };
}

