import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Activity, Target, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

// Mock data for recent customer activity
const recentActivity = [
    { name: "John Doe", activity: "Viewed Pricing Page", status: "Lead" },
    { name: "Jane Smith", activity: "Completed Purchase", status: "Converted" },
    { name: "Sam Wilson", activity: "Sent a message", status: "Inquiry" },
    { name: "Alice Brown", activity: "Viewed Demo Video", status: "Lead" },
]


export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Customer & Lead Analytics</CardTitle>
                <CardDescription>
                    AI-powered insights into your customer lifecycle.
                </CardDescription>
            </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatCard title="New Leads" value="+78" icon={Users} description="+15% from last month" />
            <StatCard title="Active Inquiries" value="32" icon={Activity} description="Awaiting response" />
            <StatCard title="Conversion Rate" value="5.2%" icon={Target} description="-0.5% from last month" />
            <StatCard title="Avg. Sale Value" value="Rs. 8,450" icon={TrendingUp} description="+10% from last month" />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Customer Activity</CardTitle>
                <CardDescription>
                    Track the latest interactions with your customers and leads.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivity.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.activity}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Converted' ? 'default' : 'secondary'}>{item.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
