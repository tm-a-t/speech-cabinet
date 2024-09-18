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
    <Button className="mt-2 mx-auto" onClick={reset}>Reset my dialogue saved data</Button>
  )
}
