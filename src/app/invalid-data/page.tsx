'use client';

import {defaultData} from '../_lib/data-types';
import {Button} from '~/app/_components/ui/button';
import { useRouter } from 'next/navigation';

export default function ResetPage() {
  const router = useRouter()

  function reset() {
    localStorage.setItem('data', JSON.stringify(defaultData));
    router.push('/');
  }

  return (
    <div className="text-center max-w-sm mx-auto pt-8">
      <p>
        Sorry, the site couldn&apos;t read your dialogue file.
        If you don't care about your saved data, you can reset it and start over.
        Otherwise, please contact <a href="https://www.reddit.com/user/stop-those-tomatoes/" className="underline underline-offset-4 text-nowrap" target="_blank">u/stop-those-tomatoes</a>
      </p>
      <Button variant="destructive" className="mt-12 mx-auto" onClick={reset}>Reset my dialogue</Button>
    </div>
  )
}
