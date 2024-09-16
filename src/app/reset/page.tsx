'use client';

import {redirect} from 'next/navigation';
import {defaultData} from '../_lib/data-types';
import {Button} from '~/app/_components/ui/button';

export default function ResetPage() {
  function reset() {
    localStorage.setItem('data', JSON.stringify(defaultData));
    redirect('/editor');
  }

  return (
    <Button className="mt-2 mx-auto" onClick={reset}>Reset my dialogue saved data</Button>
  )
}
