import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrders } from "@/lib/data";
import { OrdersTable } from "@/components/orders/data-table";
import { columns } from "@/components/orders/columns";

export default async function OrdersPage() {
  const data = await getOrders();
  const tabs = ["All", "Pending", "Paid", "Udhaari", "Completed"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                    Manage your orders and view their details.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                    </span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Order
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="All">
          <TabsList>
            {tabs.map(tab => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab} value={tab}>
                <OrdersTable columns={columns} data={tab === "All" ? data : data.filter(d => d.status === tab)} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
