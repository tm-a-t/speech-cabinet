'use client';

import {redirect} from 'next/navigation';
import {defaultData} from '../_lib/data-types';

export default function ResetPage() {
  localStorage.setItem('data', JSON.stringify(defaultData));
  redirect('/editor');
}
