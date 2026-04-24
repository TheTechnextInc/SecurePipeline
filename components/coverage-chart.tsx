"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { date: "Jan 10", coverage: 65, threshold: 80 },
  { date: "Jan 11", coverage: 68, threshold: 80 },
  { date: "Jan 12", coverage: 71, threshold: 80 },
  { date: "Jan 13", coverage: 69, threshold: 80 },
  { date: "Jan 14", coverage: 74, threshold: 80 },
  { date: "Jan 15", coverage: 76, threshold: 80 },
  { date: "Jan 16", coverage: 73, threshold: 80 },
  { date: "Jan 17", coverage: 72, threshold: 80 },
]

export function CoverageChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Code Coverage Trend</h2>
          <p className="text-sm text-muted-foreground">Last 7 days</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Threshold (80%)</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.15 250)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.15 250)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
            />
            <YAxis
              domain={[50, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "8px",
                color: "oklch(0.95 0 0)",
              }}
              formatter={(value: number) => [`${value}%`, "Coverage"]}
            />
            <Area
              type="monotone"
              dataKey="threshold"
              stroke="oklch(0.55 0.22 25)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="coverage"
              stroke="oklch(0.65 0.15 250)"
              strokeWidth={2}
              fill="url(#colorCoverage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
