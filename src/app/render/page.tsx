import {Player} from '~/app/_components/play-mode/player';
import {SavedData} from '../_lib/data-types';

export default function Page({searchParams}: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = JSON.parse((searchParams.data as string | null) ?? 'null') as SavedData || null;

  return (
    <Player data={data}/>
  );
}
