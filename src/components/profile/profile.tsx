import { useCallback, useEffect, useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';

import { Container } from '../container';
import { GitViewsBadge } from '../GitViewsBadge';
import { ThemeSwitcher } from '../ThemeSwitcher';

import styles from './profile.module.css';
import { cn } from '@/helpers/styles';
import { ProfileSchema } from '@/validators/profile';
import type { z } from 'zod/mini';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  markdownFile: string;
}

interface ProfileProps {
  source: string;
  username: string;
  posts?: BlogPost[];
}

export function Profile({ source, username, posts = [] }: ProfileProps) {
  const [profile, setProfile] = useState<z.infer<typeof ProfileSchema> | null>(
    null,
  );
  const [errors, setErrors] = useState<
    Array<{ message: string; path: string }>
  >([]);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    const res = await fetch(source);

    if (!res.ok) return setError('Profile not found.');

    const data = await res.json();

    const parsed = ProfileSchema.safeParse(data);

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map(issue => ({
          message: issue.message,
          path: issue.path.join(' → '),
        })),
      );
    } else {
      setProfile(parsed.data);
    }
  }, [source]);

  useEffect(() => {
    fetchProfile().catch(() =>
      setError('Something went wrong. The JSON file might be invalid.'),
    );
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} — OPN`;
    }

    if (profile?.style?.theme === 'light') {
      document.body.style.background = 'var(--color-neutral-950)';
    }
  }, [profile]);

  if (error) {
    return (
      <div className={styles.singleError}>
        <Container>
          <p className={styles.errorText}>Error: {error}</p>
        </Container>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <Container>
        <div className={styles.errors}>
          <h1 className={styles.title}>Wrong Format:</h1>

          {errors.map((error, i) => (
            <p className={styles.error} key={i}>
              <span>[{error.path}]:</span> {error.message}
            </p>
          ))}
        </div>
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <div
      className={cn(
        profile.style?.theme === 'light' && styles.light,
        profile.style?.font === 'serif' && styles.serif,
      )}
    >
      <Container>
        <div className={styles.topBar}>
          <div className={styles.logo} />
          <ThemeSwitcher initialTheme={profile.style?.theme === 'light' ? 'light' : 'dark'} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.description}>{profile.description}</p>
        </header>
        <main>
          {/* Render sections that are NOT links (socials) first */}
          {profile.sections &&
            profile.sections
              .filter(section => section.type !== 'links')
              .map((section, index) => (
                <Section key={index} title={section.title}>
                  {section.type === 'list' ? (
                    <div className={styles.items}>
                      {section.items.map((item, idx) => (
                        <div className={styles.item} key={idx}>
                          {item.url ? (
                            <a className={styles.title} href={item.url}>
                              {item.title}
                              <span>
                                <MdArrowOutward />
                              </span>
                            </a>
                          ) : (
                            <p className={styles.title}>{item.title}</p>
                          )}

                          {item.description && (
                            <p className={styles.description}>
                              {item.description}
                            </p>
                          )}

                          {item.date && (
                            <p className={styles.date}>({item.date})</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : section.type === 'text' ? (
                    <p className={styles.text}>{section.content}</p>
                  ) : section.type === 'gitviews' ? (
                    <div className={styles.gitviews}>
                      {section.profileViews && (
                        <GitViewsBadge
                          type="profile"
                          username={username}
                          style={section.style}
                          labelColor={section.labelColor}
                          color={section.color}
                        />
                      )}
                      {section.repoViews &&
                        section.repoViews.map((repo, idx) => (
                          <GitViewsBadge
                            key={idx}
                            type="repo"
                            username={repo.username}
                            repo={repo.repo}
                            style={section.style}
                            labelColor={section.labelColor}
                            color={section.color}
                          />
                        ))}
                      {section.allReposViews && (
                        <GitViewsBadge
                          type="allRepos"
                          username={username}
                          style={section.style}
                          labelColor={section.labelColor}
                          color={section.color}
                        />
                      )}
                    </div>
                  ) : null}
                </Section>
              ))}
          
          {/* Blog Posts Section - appears before social links */}
          {posts.length > 0 && (
            <Section title="Articles">
              <div className={styles.items}>
                {posts.map((post, index) => (
                  <div className={styles.item} key={index}>
                    <a className={styles.title} href={`/@${username}/${post.slug}`}>
                      {post.title}
                      <span>
                        <MdArrowOutward />
                      </span>
                    </a>
                    {post.excerpt && (
                      <p className={styles.description}>{post.excerpt}</p>
                    )}
                    {post.date && (
                      <p className={styles.date}>
                        ({new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Social Links Section - always appears last */}
          {profile.sections &&
            profile.sections
              .filter(section => section.type === 'links')
              .map((section, index) => (
                <Section key={`links-${index}`} title={section.title}>
                  <div className={cn(styles.socials)}>
                    {section.links.map((link, idx) => (
                      <a href={link.url} key={idx}>
                        {link.title}
                      </a>
                    ))}
                  </div>
                </Section>
              ))}
        </main>
        <footer className={styles.footer}>
          Created using <a href="https://opn.bio">OPN</a>.
        </footer>
      </Container>
    </div>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {title} <div />
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
