import {Button} from '~/app/_components/ui/button';
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="w-72 max-w-full mx-auto px-1 py-8">
      <p>Helloiw or</p>
      <Button asChild variant="secondary" className="mt-4">
        <Link href="/editor">Go to editor</Link>
      </Button>
    </div>
  )
}