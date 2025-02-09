'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const demoData = [
  { date: 'Jan', battles: 320 },
  { date: 'Feb', battles: 450 },
  { date: 'Mar', battles: 520 },
  { date: 'Apr', battles: 680 },
  { date: 'May', battles: 790 },
  { date: 'Jun', battles: 980 },
  { date: 'Jul', battles: 1200 },
];

export function ActivityChart() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Platform Activity</h3>
        <p className="text-sm text-muted-foreground">Daily battles across all formats</p>
      </div>
      <div className="h-[300px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={demoData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Area
              type="monotone"
              dataKey="battles"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 