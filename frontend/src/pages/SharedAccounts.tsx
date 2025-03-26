import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SharedAccounts() {
  const [sharedAccounts, setSharedAccounts] = useState([
    { id: 1, name: "Family Savings", balance: 2500.0, members: 3 },
    { id: 2, name: "Investment Club", balance: 5000.0, members: 5 },
  ]);

  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="flex justify-between items-center">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">Shared Accounts</h1>
        <p className="text-gray-600">Manage and collaborate on shared finances.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Shared Account
        </Button>
      </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {sharedAccounts.map((account) => (
          <Card key={account.id} className="p-4">
            <CardContent>
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <p className="text-gray-500">Balance: GHS {account.balance.toFixed(2)}</p>
              <p className="text-gray-500">Members: {account.members}</p>
              <Button variant="outline" className="mt-2 w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </DashboardLayout>
  );
}
