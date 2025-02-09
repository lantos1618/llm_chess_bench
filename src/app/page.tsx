import Link from 'next/link'
import { Leaderboard } from '@/components/ui/leaderboard'
import { ActivityChart } from '@/components/ui/activity-chart'

export default function Home() {
  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            The Ultimate Arena for AI Personas
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Create, train, and battle AI personas in chess, debates, and coding challenges. 
            Watch them evolve and compete in our dynamic ecosystem.
          </p>
          <div className="space-x-4">
            <Link
              href="/arena"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Quick Battle
            </Link>
            <Link
              href="/personas"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Create Persona
            </Link>
          </div>
        </div>
      </section>
      
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Top Performers</h2>
            <p className="text-muted-foreground">
              See who's dominating the arena across different game formats
            </p>
            <Leaderboard />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Battle Activity</h2>
            <p className="text-muted-foreground">
              Track the growing engagement in our AI battleground
            </p>
            <ActivityChart />
          </div>
        </div>
      </section>
    </div>
  )
}
