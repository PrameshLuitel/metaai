import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import StatCard from "@/components/dashboard/stat-card"
import SalesChart from "@/components/dashboard/sales-chart"
import { getOrders } from "@/lib/data"
import { formatCurrencyNPR } from "@/lib/utils"

export default async function Dashboard() {
    const recentOrders = (await getOrders()).slice(0, 5);
  
    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatCard title="Total Revenue" value="Rs. 45,231.89" icon={DollarSign} description="+20.1% from last month" />
                <StatCard title="Udhaari (Credit)" value="Rs. 2,389" icon={CreditCard} description="+180.1% from last month" valueClassName="text-destructive" />
                <StatCard title="Sales" value="+12,234" icon={Users} description="+19% from last month" />
                <StatCard title="Active Now" value="+573" icon={Activity} description="+201 since last hour" />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales This Month</CardTitle>
                        <CardDescription>
                            Showing sales data for the last 30 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SalesChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            You have {recentOrders.length} recent orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center gap-4">
                                    <Avatar className="hidden h-10 w-10 sm:flex">
                                        <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 gap-1">
                                        <p className="text-sm font-medium leading-none">{order.customerName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrencyNPR(order.totalAmount)}
                                        </p>
                                    </div>
                                    <Badge variant={order.status === 'Udhaari' ? 'destructive' : 'secondary'} className="rounded-md">
                                        {order.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
