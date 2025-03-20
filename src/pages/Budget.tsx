import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Budget = () => {
  const auth = useContext(AuthContext);
  const {user} = auth
  const { toast } = useToast();
  const [isNewBudgetDialogOpen, setIsNewBudgetDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("month");


  // Sample budget data
  const weeklyBudgetData = [
    { id: 1, category: "Housing", budgeted: 300, spent: 300, remaining: 0, status: "on-track" },
    { id: 2, category: "Food & Dining", budgeted: 150, spent: 120, remaining: 30, status: "on-track" },
    { id: 3, category: "Transportation", budgeted: 85, spent: 70, remaining: 15, status: "on-track" },
    { id: 4, category: "Utilities", budgeted: 75, spent: 70, remaining: 5, status: "on-track" },
    { id: 5, category: "Entertainment", budgeted: 50, spent: 35, remaining: 15, status: "on-track" },
    { id: 6, category: "Shopping", budgeted: 50, spent: 60, remaining: -10, status: "over-budget" },
    { id: 7, category: "Health & Fitness", budgeted: 35, spent: 25, remaining: 10, status: "on-track" },
    { id: 8, category: "Personal Care", budgeted: 25, spent: 20, remaining: 5, status: "on-track" },
    { id: 9, category: "Subscriptions", budgeted: 12, spent: 12, remaining: 0, status: "on-track" },
    { id: 10, category: "Other", budgeted: 25, spent: 10, remaining: 15, status: "on-track" },
  ];

  const monthlyBudgetData = [
    { id: 1, category: "Housing", budgeted: 1200, spent: 1200, remaining: 0, status: "on-track" },
    { id: 2, category: "Food & Dining", budgeted: 600, spent: 500, remaining: 100, status: "on-track" },
    { id: 3, category: "Transportation", budgeted: 350, spent: 300, remaining: 50, status: "on-track" },
    { id: 4, category: "Utilities", budgeted: 300, spent: 290, remaining: 10, status: "on-track" },
    { id: 5, category: "Entertainment", budgeted: 200, spent: 150, remaining: 50, status: "on-track" },
    { id: 6, category: "Shopping", budgeted: 200, spent: 250, remaining: -50, status: "over-budget" },
    { id: 7, category: "Health & Fitness", budgeted: 150, spent: 100, remaining: 50, status: "on-track" },
    { id: 8, category: "Personal Care", budgeted: 100, spent: 80, remaining: 20, status: "on-track" },
    { id: 9, category: "Subscriptions", budgeted: 50, spent: 50, remaining: 0, status: "on-track" },
    { id: 10, category: "Other", budgeted: 100, spent: 30, remaining: 70, status: "on-track" },
  ];

  const yearlyBudgetData = [
    { id: 1, category: "Housing", budgeted: 14400, spent: 14000, remaining: 400, status: "on-track" },
    { id: 2, category: "Food & Dining", budgeted: 7200, spent: 6800, remaining: 400, status: "on-track" },
    { id: 3, category: "Transportation", budgeted: 4200, spent: 3900, remaining: 300, status: "on-track" },
    { id: 4, category: "Utilities", budgeted: 3600, spent: 3500, remaining: 100, status: "on-track" },
    { id: 5, category: "Entertainment", budgeted: 2400, spent: 2200, remaining: 200, status: "on-track" },
    { id: 6, category: "Shopping", budgeted: 2400, spent: 2600, remaining: -200, status: "over-budget" },
    { id: 7, category: "Health & Fitness", budgeted: 1800, spent: 1700, remaining: 100, status: "on-track" },
    { id: 8, category: "Personal Care", budgeted: 1200, spent: 1100, remaining: 100, status: "on-track" },
    { id: 9, category: "Subscriptions", budgeted: 600, spent: 600, remaining: 0, status: "on-track" },
    { id: 10, category: "Other", budgeted: 1200, spent: 1000, remaining: 200, status: "on-track" },
  ];

  // State to manage current budget data based on time range
  const [budgetData, setBudgetData] = useState(monthlyBudgetData);
  const [budgetBook, setBudgetBook] = useState([])
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (value !== "Other") {
      setCustomCategory(""); // Reset custom category if not "Other"
    }
  };

  const submitBudget = async () => {
    if (!user || !user.uid) {
      toast({ title: "Error", description: "User not authenticated!", variant: "destructive" });
      return;
    }

    if (!category) {
      toast({ title: "Error", description: "Please select a category.", variant: "destructive" });
      return;
    }

    if (category === "Other" && !customCategory.trim()) {
      toast({ title: "Error", description: "Custom category is required for 'Other'.", variant: "destructive" });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Error", description: "Enter a valid budget amount.", variant: "destructive" });
      return;
    }

    try {
      const budgetData = {
        userId: user.uid,
        budgetId: "BGT-"+uuidv4(),
        category,
        customCategory: category === "Other" ? customCategory : "",
        amount: parseFloat(amount),
        notes,
        date
      };

      const API_URL = "http://localhost:5000/api/budgets/";
      await axios.post(API_URL, budgetData);

      toast({
        title: "Budget Created!",
        description: `Your ${category === "Other" ? customCategory : category} budget has been added.`,
      });

      setIsNewBudgetDialogOpen(false);
      setCategory("");
      setCustomCategory("");
      setAmount("");
      setNotes("");
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Your budget wasn't created. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Fetch budget and log it
    const fetchBudget = async () => {
      
      try {
        const response = await axios.get(`http://localhost:5000/api/budgets/${user.uid}`);
        console.log(response.data); // Check the structure here
        setBudgetBook(response.data || []);
      } catch (error) {
        console.error("Error fetching budgets:", error);
        toast({
          title: "Fetch Error",
          description: "Could not fetch budget data.",
          variant: "destructive",
        });
      }
    };
  
    fetchBudget();
  }, [user]);

 

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

    const transactionss = [
      { date: "2025-03-19T12:00:00Z", amount: 100 },
      { date: "2025-03-15T12:00:00Z", amount: 50 },
      { date: "2025-02-20T12:00:00Z", amount: 75 },
      // Add more transactions as needed
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth()
    
    // Calculate the start of the week (assuming the week starts on Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // to last Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Reset to start of the day

    // Calculate the end of the week (last Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // to next Saturday
    endOfWeek.setHours(23, 59, 59, 999); // Reset to end of the day

    const totalBudgetedAmount = budgetBook.reduce((sum, item) => sum + item.amount, 0);
    const totalAmountSpent = transactions.reduce((sum, item) => sum + item.amount, 0);
    const totalAmountRemaining = totalBudgetedAmount - totalAmountSpent;
    const amountSpentPercentage = Math.round((totalAmountSpent / totalBudgetedAmount) * 100);

    const monthlyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const monthlyTransactionData = transactions.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const weeklyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
    
    // Filter transactions for the current week
    const weeklyTransactionData = transactionss.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
    
    // Calculate totals for the current week
    const totalWeeklyBudgetedAmount = weeklyBudgetedData.reduce((sum, item) => sum + item.amount, 0);
    const totalWeeklySpentAmount = weeklyTransactionData.reduce((sum, item) => sum + item.amount, 0);
    const totalWeeklyRemainingAmount = totalWeeklyBudgetedAmount - totalWeeklySpentAmount;
    const weeklyAmountSpentPercentage = totalWeeklyBudgetedAmount > 0 ? Math.round((totalWeeklySpentAmount / totalWeeklyBudgetedAmount) * 100) : 0;

    // console.log(totalMonthlySpent)
// 
    const totalMonthlyBudgeted = monthlyBudgetedData.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlySpent = monthlyTransactionData.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlyRemaining = totalMonthlyBudgeted - totalMonthlySpent;
    const monthlySpentPercentage = Math.round((totalMonthlySpent / totalMonthlyBudgeted) * 100);
    
  // Update budget data when time range changes
  useEffect(() => {
    switch (timeRange) {
      case "week":
        setBudgetData(weeklyBudgetData);
        break;
      case "month":
        setBudgetData(monthlyBudgetData);
        break;
      case "year":
        setBudgetData(yearlyBudgetData);
        break;
      default:
        setBudgetData(monthlyBudgetData);
    }
  }, [timeRange]);
 



  // Weekly spending trends data
  const weeklySpendingData = [
    { name: "Mon", Housing: 40, Food: 20, Transportation: 10, Utilities: 5, Entertainment: 10, Shopping: 15, Other: 10 },
    { name: "Tue", Housing: 40, Food: 25, Transportation: 12, Utilities: 0, Entertainment: 5, Shopping: 10, Other: 8 },
    { name: "Wed", Housing: 40, Food: 18, Transportation: 15, Utilities: 0, Entertainment: 12, Shopping: 5, Other: 10 },
    { name: "Thu", Housing: 40, Food: 22, Transportation: 8, Utilities: 0, Entertainment: 15, Shopping: 0, Other: 5 },
    { name: "Fri", Housing: 40, Food: 30, Transportation: 10, Utilities: 0, Entertainment: 25, Shopping: 20, Other: 7 },
    { name: "Sat", Housing: 40, Food: 35, Transportation: 5, Utilities: 70, Entertainment: 30, Shopping: 25, Other: 10 },
    { name: "Sun", Housing: 40, Food: 28, Transportation: 10, Utilities: 0, Entertainment: 20, Shopping: 15, Other: 8 },
  ];

  // Monthly spending trends data
  const monthlySpendingData = [
    { name: "Jan", Housing: 1200, Food: 550, Transportation: 300, Utilities: 280, Entertainment: 180, Shopping: 220, Other: 300 },
    { name: "Feb", Housing: 1200, Food: 580, Transportation: 320, Utilities: 290, Entertainment: 190, Shopping: 200, Other: 280 },
    { name: "Mar", Housing: 1200, Food: 520, Transportation: 290, Utilities: 285, Entertainment: 170, Shopping: 240, Other: 270 },
    { name: "Apr", Housing: 1200, Food: 540, Transportation: 310, Utilities: 295, Entertainment: 160, Shopping: 230, Other: 290 },
    { name: "May", Housing: 1200, Food: 500, Transportation: 300, Utilities: 290, Entertainment: 150, Shopping: 250, Other: 260 },
  ];

  // Yearly spending trends data
  const yearlySpendingData = [
    { name: "2020", Housing: 13800, Food: 6500, Transportation: 3600, Utilities: 3400, Entertainment: 2100, Shopping: 2300, Other: 3100 },
    { name: "2021", Housing: 14000, Food: 6700, Transportation: 3800, Utilities: 3450, Entertainment: 2200, Shopping: 2400, Other: 3000 },
    { name: "2022", Housing: 14200, Food: 6900, Transportation: 3900, Utilities: 3500, Entertainment: 2300, Shopping: 2500, Other: 3200 },
    { name: "2023", Housing: 14400, Food: 7100, Transportation: 4000, Utilities: 3550, Entertainment: 2350, Shopping: 2550, Other: 3250 },
  ];

  // State to manage spending data based on time range
  const [spendingData, setSpendingData] = useState(monthlySpendingData);

  // Update spending data when time range changes
  useEffect(() => {
    switch (timeRange) {
      case "week":
        setSpendingData(weeklySpendingData);
        break;
      case "month":
        setSpendingData(monthlySpendingData);
        break;
      case "year":
        setSpendingData(yearlySpendingData);
        break;
      default:
        setSpendingData(monthlySpendingData);
    }
  }, [timeRange]);

  // Calculate totals
  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const spentPercentage = Math.round((totalSpent / totalBudgeted) * 100);

  const COLORS = ["#6E59A5", "#9b87f5", "#4CAF50", "#F44336", "#2196F3", "#FFC107", "#757575"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <div className="flex items-center gap-2">
            <Tabs value={timeRange} onValueChange={setTimeRange} className="mr-4">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setIsNewBudgetDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">GHS {timeRange == "year" ? totalBudgetedAmount.toLocaleString() : timeRange == "month" ? totalMonthlyBudgeted.toLocaleString() : timeRange == "week" ? totalWeeklyBudgetedAmount.toLocaleString() : null}</div>
                  <p className="text-xs text-muted-foreground">
                    {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Yearly"} budget allocation
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">GHS {timeRange == "year" ? totalAmountSpent.toLocaleString() : timeRange == "month" ? totalMonthlySpent.toLocaleString() : timeRange == "week" ? totalWeeklySpentAmount.toLocaleString() : null}</div>
                  <div className="flex items-center text-xs">
                    <span>{timeRange === "week" ? weeklyAmountSpentPercentage : timeRange === "month" ? monthlySpentPercentage : amountSpentPercentage}% of {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Yearly"} budget</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">GHS {timeRange == "year" ? totalAmountRemaining.toLocaleString() : timeRange == "month" ? totalMonthlyRemaining.toLocaleString() : timeRange == "week" ? totalWeeklyRemainingAmount.toLocaleString() : null}</div>
                  <div className="flex items-center text-xs">
                  <span>{timeRange === "week" ? 100-weeklyAmountSpentPercentage : timeRange === "month" ? 100-monthlySpentPercentage : 100-amountSpentPercentage}% of {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Yearly"} budget remaining</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Yearly"} Budget Summary
                </CardTitle>
                <CardDescription>
                  Your spending progress for the current {timeRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Progress</span>
                    <span>${totalSpent.toLocaleString()} of ${totalBudgeted.toLocaleString()}</span>
                  </div>
                  <Progress value={spentPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {totalRemaining >= 0
                      ? `You have $${totalRemaining.toLocaleString()} remaining in your monthly budget`
                      : `You are $${Math.abs(totalRemaining).toLocaleString()} over your monthly budget`}
                  </p>
                </div>

                <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Top Categories</h3>
                    
                    {budgetData.slice(0, 4).map((budget) => (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{budget.category}</span>
                          <span>${budget.spent.toLocaleString()} of ${budget.budgeted.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(budget.spent / budget.budgeted) * 100} 
                          className={`h-2 ${budget.spent > budget.budgeted ? 'bg-rose-100' : ''}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {budget.remaining >= 0
                              ? `$${budget.remaining} remaining`
                              : `$${Math.abs(budget.remaining)} over budget`}
                          </span>
                          <span>{Math.round((budget.spent / budget.budgeted) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("categories")}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View All Categories
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Budget Alerts</h3>
                    
                    {budgetData.filter(budget => budget.status === "over-budget").length > 0 ? (
                      <div className="space-y-4">
                        {budgetData
                          .filter(budget => budget.status === "over-budget")
                          .map(budget => (
                            <div key={budget.id} className="flex items-center p-3 bg-rose-50 border border-rose-200 rounded-md">
                              <AlertTriangle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {budget.category} is over budget by ${Math.abs(budget.remaining)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  You've spent ${budget.spent} of ${budget.budgeted} budget
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                        <TrendingUp className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">
                            All categories are within budget
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Keep up the good work!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Spending Tip</h4>
                      <p className="text-sm text-muted-foreground">
                        Try to keep your non-essential spending under 30% of your total income to maintain healthy finances.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>
                  Manage your {timeRange === "week" ? "weekly" : timeRange === "month" ? "monthly" : "yearly"} budget categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Budgeted</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Spent</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Remaining</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
                          <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {budgetData.map((budget) => (
                          <tr key={budget.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{budget.category}</td>
                            <td className="p-4 align-middle">${budget.budgeted.toLocaleString()}</td>
                            <td className="p-4 align-middle">${budget.spent.toLocaleString()}</td>
                            <td className={`p-4 align-middle font-medium ${budget.remaining < 0 ? 'text-rose-600' : budget.remaining === 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {budget.remaining >= 0 
                                ? `$${budget.remaining.toLocaleString()}` 
                                : `-$${Math.abs(budget.remaining).toLocaleString()}`}
                            </td>
                            <td className="p-4 align-middle w-[200px]">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={(budget.spent / budget.budgeted) * 100} 
                                  className={`h-2 flex-grow ${budget.spent > budget.budgeted ? 'bg-rose-100' : ''}`}
                                />
                                <span className="text-xs w-[40px] text-right">
                                  {Math.round((budget.spent / budget.budgeted) * 100)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                  {timeRange === "week" ? "Daily" : timeRange === "month" ? "Monthly" : "Yearly"} spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={spendingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="Housing" stackId="a" fill={COLORS[0]} />
                    <Bar dataKey="Food" stackId="a" fill={COLORS[1]} />
                    <Bar dataKey="Transportation" stackId="a" fill={COLORS[2]} />
                    <Bar dataKey="Utilities" stackId="a" fill={COLORS[3]} />
                    <Bar dataKey="Entertainment" stackId="a" fill={COLORS[4]} />
                    <Bar dataKey="Shopping" stackId="a" fill={COLORS[5]} />
                    <Bar dataKey="Other" stackId="a" fill={COLORS[6]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Month-over-Month Change</CardTitle>
                  <CardDescription>Compare spending with previous month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Spending</span>
                      <div className="flex items-center text-emerald-600">
                        <TrendingDown className="mr-1 h-4 w-4" />
                        <span>-3.2%</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {budgetData.slice(0, 5).map((budget, index) => (
                        <div key={budget.id} className="flex items-center justify-between text-sm">
                          <span>{budget.category}</span>
                          <div className={`flex items-center ${index % 2 === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {index % 2 === 0 ? (
                              <>
                                <TrendingDown className="mr-1 h-4 w-4" />
                                <span>-{(index + 1) * 2}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingUp className="mr-1 h-4 w-4" />
                                <span>+{(index) * 1.5}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Efficiency</CardTitle>
                  <CardDescription>How well you're using your budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold">87%</span>
                      <span className="text-sm text-muted-foreground">Budget efficiency score</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">What this means:</span>
                      <p className="text-sm text-muted-foreground">
                        You're effectively using 87% of your budget allocation. This indicates good planning and spending discipline.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Improvement tips:</span>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>Review your Shopping category which is currently over budget</li>
                        <li>Consider increasing your Entertainment budget which is consistently underspent</li>
                        <li>Track your daily expenses more closely to avoid end-of-month surprises</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Budget Dialog */}
      <Dialog open={isNewBudgetDialogOpen} onOpenChange={setIsNewBudgetDialogOpen}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>Set up a new budget category to track your spending.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
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
                <SelectItem value="Other">Other</SelectItem> {/* Capitalize "Other" for consistency */}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="custom-category">Or create custom category</Label>
            <Input 
              id="custom-category" 
              placeholder="e.g., Pet Expenses" 
              value={customCategory} 
              onChange={(e) => setCustomCategory(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget-amount">Monthly Budget Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget-amount"
                  type="number"
                  className="pl-8"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} // Setup the state for amount
                />
              </div>
            </div>
            <div className="grid gap-2 justify-center">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} className="w-full" onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="budget-notes">Notes (Optional)</Label>
            <Input
              id="budget-notes"
              placeholder="Add any notes about this budget category"
              value={notes}
              onChange={(e) => setNotes(e.target.value)} // Setup the state for notes
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsNewBudgetDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitBudget}>Create Budget</Button> {/* Call the submit function */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </DashboardLayout>
  );
};

export default Budget;
