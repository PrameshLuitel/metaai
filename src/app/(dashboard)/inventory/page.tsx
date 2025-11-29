import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInventory } from "@/lib/data";
import { InventoryTable } from "@/components/inventory/data-table";
import { columns } from "@/components/inventory/columns";

export default async function InventoryPage() {
  const data = await getInventory();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                    Manage your products and view their sales performance.
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
                    Add Product
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <InventoryTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
