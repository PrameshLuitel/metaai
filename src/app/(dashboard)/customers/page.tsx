import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUsers } from "@/lib/data";
import { CustomersTable } from "@/components/customers/data-table";
import { columns } from "@/components/customers/columns";

export default async function CustomersPage() {
  const data = await getUsers();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Customers & Users</CardTitle>
                <CardDescription>
                    Manage your customers and internal users.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add User
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <CustomersTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
