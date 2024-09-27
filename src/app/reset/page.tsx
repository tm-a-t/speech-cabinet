'use client';

import {getDefaultData, serialize} from '~/lib/disco-data';
import {Button} from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ResetPage() {
  const router = useRouter()

  function reset() {
    localStorage.setItem('data', serialize(getDefaultData()));
    router.push('/');
  }

  return (
    <Button className="mt-2 mx-auto" onClick={reset}>Reset my dialogue saved data</Button>
  )
}
