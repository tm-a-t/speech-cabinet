import * as React from 'react';
import { cn } from '~/lib/utils';
import Image from 'next/image';

enum State {
  loading,
  error,
  success,
}

export function SkeletonImage({className, alt, ...props}: React.ComponentProps<typeof Image>) {
  const [state, setState] = React.useState(State.loading);
  return (
    <Image
      className={cn(state === State.loading ? 'animate-pulse bg-zinc-100 dark:bg-zinc-800 text-transparent' : state == State.error ? 'opacity-0' : '', className)}
      loading="lazy"
      onLoad={() => setState(State.success)}
      onError={() => setState(State.error)}
      alt={alt ?? ""}
      {...props}
    />
  )
}