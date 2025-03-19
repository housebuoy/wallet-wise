
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreditCard, RotateCw, PiggyBank } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCloseDialog = () => setActiveDialog(null);

  const handleSubmit = () => {
    toast({
      title: "Success",
      description: activeDialog === "payment-methods" 
        ? "Payment method added successfully" 
        : activeDialog === "recurring" 
        ? "Recurring payment configured" 
        : "Funds transferred successfully",
    });
    setActiveDialog(null);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 mb-4">Manage your payment methods and make transactions.</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <CreditCard className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium text-lg mb-1">Payment Methods</h3>
              <p className="text-gray-500 text-sm">Add or manage your payment methods</p>
              <button 
                className="mt-4 text-blue-500 hover:underline text-sm"
                onClick={() => setActiveDialog("payment-methods")}
              >
                Manage
              </button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <RotateCw className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium text-lg mb-1">Recurring Payments</h3>
              <p className="text-gray-500 text-sm">Set up automatic payments</p>
              <button 
                className="mt-4 text-blue-500 hover:underline text-sm"
                onClick={() => setActiveDialog("recurring")}
              >
                Configure
              </button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <PiggyBank className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium text-lg mb-1">Transfer Funds</h3>
              <p className="text-gray-500 text-sm">Move money between accounts</p>
              <button 
                className="mt-4 text-blue-500 hover:underline text-sm"
                onClick={() => setActiveDialog("transfer")}
              >
                Transfer
              </button>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            <div className="border rounded p-3 flex justify-between">
              <div>
                <p className="font-medium">Netflix Subscription</p>
                <p className="text-gray-500 text-sm">May 12, 2023</p>
              </div>
              <p className="font-medium text-red-500">-$14.99</p>
            </div>
            <div className="border rounded p-3 flex justify-between">
              <div>
                <p className="font-medium">Grocery Store</p>
                <p className="text-gray-500 text-sm">May 10, 2023</p>
              </div>
              <p className="font-medium text-red-500">-$65.32</p>
            </div>
            <div className="border rounded p-3 flex justify-between">
              <div>
                <p className="font-medium">Salary Deposit</p>
                <p className="text-gray-500 text-sm">May 1, 2023</p>
              </div>
              <p className="font-medium text-green-500">+$2,450.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Dialog */}
      <Dialog open={activeDialog === "payment-methods"} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Payment Methods</DialogTitle>
            <DialogDescription>
              Add or edit your payment methods
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input id="card-name" placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="•••• •••• •••• ••••" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="•••" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recurring Payments Dialog */}
      <Dialog open={activeDialog === "recurring"} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Up Recurring Payment</DialogTitle>
            <DialogDescription>
              Configure automatic recurring payments
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-name">Payment Name</Label>
              <Input id="payment-name" placeholder="e.g. Netflix Subscription" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-amount">Amount</Label>
              <Input id="payment-amount" placeholder="$0.00" type="number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-frequency">Frequency</Label>
              <Select>
                <SelectTrigger id="payment-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-startdate">Start Date</Label>
              <Input id="payment-startdate" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card-1">Visa ending in 4242</SelectItem>
                  <SelectItem value="card-2">Mastercard ending in 5555</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>Set Up Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Funds Dialog */}
      <Dialog open={activeDialog === "transfer"} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
            <DialogDescription>
              Move money between your accounts
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="from-account">From Account</Label>
              <Select>
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account - $5,400.50</SelectItem>
                  <SelectItem value="savings">Savings Account - $12,750.85</SelectItem>
                  <SelectItem value="investment">Investment Account - $8,300.25</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to-account">To Account</Label>
              <Select>
                <SelectTrigger id="to-account">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account - $5,400.50</SelectItem>
                  <SelectItem value="savings">Savings Account - $12,750.85</SelectItem>
                  <SelectItem value="investment">Investment Account - $8,300.25</SelectItem>
                  <SelectItem value="external">External Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transfer-amount">Amount</Label>
              <Input id="transfer-amount" placeholder="$0.00" type="number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transfer-date">Transfer Date</Label>
              <Input id="transfer-date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transfer-notes">Notes (Optional)</Label>
              <Input id="transfer-notes" placeholder="Add a memo or reference" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>Transfer Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
