"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { formatCurrencyNPR } from "@/lib/utils"

const data = [
  { name: "Week 1", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Week 2", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Week 3", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Week 4", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Week 5", total: Math.floor(Math.random() * 5000) + 1000 },
]

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatCurrencyNPR(value as number)}`}
        />
        <Tooltip 
            cursor={{fill: 'hsl(var(--accent))', opacity: 0.1}}
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
            labelStyle={{
                color: 'hsl(var(--foreground))'
            }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
