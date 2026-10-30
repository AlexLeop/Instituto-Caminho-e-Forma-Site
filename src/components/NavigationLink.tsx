import type { AnchorHTMLAttributes } from 'react';

// Real links remain usable by crawlers, keyboards, and “open in new tab”.
export function NavigationLink({onClick, ...props}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} onClick={event => {
    if (!onClick || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    event.preventDefault();
    onClick(event);
  }} />;
}
