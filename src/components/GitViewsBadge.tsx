interface GitViewsBadgeProps {
  type: 'profile' | 'repo' | 'allRepos';
  username: string;
  repo?: string;
  style?: 'flat' | 'flat-square' | 'for-the-badge' | 'social' | 'plastic';
  labelColor?: string;
  color?: string;
}

export function GitViewsBadge({
  type,
  username,
  repo,
  style = 'flat',
  labelColor,
  color,
}: GitViewsBadgeProps) {
  let url = '';

  if (type === 'profile') {
    url = `https://gitviews.com/user/${username}.svg`;
  } else if (type === 'repo') {
    if (!repo) {
      return null;
    }
    url = `https://gitviews.com/repo/${username}/${repo}.svg`;
  } else if (type === 'allRepos') {
    url = `https://gitviews.com/user/${username}/repos.svg`;
  } else {
    return null;
  }

  const params = new URLSearchParams();

  if (style) {
    params.append('style', style);
  }

  if (labelColor) {
    params.append('label-color', labelColor);
  }

  if (color) {
    params.append('color', color);
  }

  const queryString = params.toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  return (
    <img
      src={finalUrl}
      alt={`GitHub ${type === 'profile' ? 'profile' : type === 'repo' ? 'repository' : 'repositories'} views`}
      loading="lazy"
    />
  );
}

