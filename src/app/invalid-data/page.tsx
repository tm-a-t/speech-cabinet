'use client';

import {getDefaultData, serialize} from '~/lib/disco-data';
import {Button} from '~/components/ui/button';
import {useRouter} from 'next/navigation';

export default function ResetPage() {
  const router = useRouter()

  function reset() {
    localStorage.setItem('data', serialize(getDefaultData()));
    router.push('/');
  }

  return (
    <div className="text-center max-w-sm mx-auto pt-8">
      <p>
        Sorry, the site couldn&apos;t read your dialogue file.
        If you don&apos;t care about your saved data, you can try resetting it.
        Otherwise, please contact <a href="https://www.reddit.com/user/stop-those-tomatoes/" className="underline underline-offset-4 text-nowrap" target="_blank">u/stop-those-tomatoes</a>
      </p>
      <span className="mt-12 justify-center flex flex-wrap gap-1">
        <Button variant="secondary" onClick={() => router.push('/')}>Retry</Button>
        <Button variant="destructive" onClick={reset}>Reset my dialogue</Button>
      </span>
    </div>
  )
}
