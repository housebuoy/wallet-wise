import { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Filter, Plus, Download, ArrowUpDown, CreditCard, Wallet, DollarSign, RefreshCw } from "lucide-react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


const Transactions = () => {
  const [transactionType, setTransactionType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [account, setAccount] = useState("");
  const { toast } = useToast();
  // Sample transaction data
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const auth = useContext(AuthContext);
  const {user} = auth

  useEffect(() => {
    if (!user) return; // Ensure user is authenticated before fetching

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transactions/${user.uid}`);
        setTransactions(response.data); // Set the fetched transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [user, transactions]);

  // Filter transactions based on the selected type
  const filteredTransactions = transactions
  .filter(transaction => 
    transactionType === "all" || transaction.type === transactionType
  )
  .filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;

  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);


    const submitTransactions = async () => {
      if (!user || !user.uid) {
        alert("User not authenticated!");
        return;
      }
      
      try {
        const transactionData = {
          userId: user.uid,
          transactionId: "TXN-"+uuidv4(), 
          type: newTransactionType,
          description,
          amount: parseFloat(amount), // Convert to number
          category,
          date,
          account,
        };
        const API_URL = "http://localhost:5000/api/transactions"
        console.log(transactionData)
        const response = await axios.post(API_URL, transactionData);
        
        toast({
          title: "Transaction created!",
          description: `Your Transaction added successfully!`,
        });
        console.log(response.data);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error adding transaction:", error);
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.message || "Your transaction wasn't created, Please try again",
        });
      }
    };
    

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            <Button variant="outline" className="flex-shrink-0">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-4">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>View and manage your transaction history</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>                  
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="All Transactions" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="income">Income Only</SelectItem>
                      <SelectItem value="expense">Expenses Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b transition-colors">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <div className="flex items-center space-x-2">
                            <span>Description</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <div className="flex items-center space-x-2">
                            <span>Category</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Account</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <div className="flex items-center space-x-2">
                            <span>Date</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <span>Amount</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md mr-3 ${transaction.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
                                {transaction.type === "income" ? (
                                  <FaCaretUp className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <FaCaretDown className="h-5 w-5 text-rose-600" />
                                )}
                              </div>
                              <span>{transaction.description}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{transaction.category}</td>
                          <td className="p-4 align-middle">{transaction.account}</td>
                          <td className="p-4 align-middle">{transaction.date ? format(new Date(transaction.date), 'dd/MM/yyyy') : 'N/A'}</td>
                          <td className={`p-4 align-middle text-right font-medium ${transaction.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount.toLocaleString("en-US", { style: "currency", currency: "GHS" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-between items-center mb-4 mx-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {Math.ceil(transactions.length / transactionsPerPage)}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / transactionsPerPage)))}
                disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Enter the details of your transaction below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={newTransactionType} onValueChange={setNewTransactionType} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="expense" id="expense" className="peer sr-only" />
                <Label
                  htmlFor="expense"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Expense
                </Label>
              </div>
              <div>
                <RadioGroupItem value="income" id="income" className="peer sr-only" />
                <Label
                  htmlFor="income"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Wallet className="mb-3 h-6 w-6" />
                  Income
                </Label>
              </div>
            </RadioGroup>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter a description"value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="amount" type="number" className="pl-8" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}/>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="personal">Personal Care</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="debt">Debt Payments</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="gifts">Gifts & Donations</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="Other">Other</SelectItem> 
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select onValueChange={setAccount}>
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="credit-chase">Chase Credit Card</SelectItem>
                  <SelectItem value="credit-amex">Amex Gold</SelectItem>
                  <SelectItem value="credit-visa">Visa Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitTransactions}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;
