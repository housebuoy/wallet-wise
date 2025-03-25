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
import { Skeleton } from "@/components/ui/skeleton";
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
  ChartAreaIcon,
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
  const [expenses, setExpenses] = useState([])
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  let isOverBudget = false;

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
      // Normalize category and customCategory for comparison
      const normalizedCategory = category.trim().toLowerCase();
      const normalizedCustomCategory = customCategory.trim().toLowerCase();
    
      // Check if the category already exists in the budgetBook
      const budgetExists = budgetBook.some(budget => {
        const budgetCategory = budget.category.trim().toLowerCase();
        const budgetCustomCategory = budget.customCategory.trim().toLowerCase();
    
        const isSameCategory = budgetCategory === normalizedCategory;
        const isSameCustomCategory = category !== "Other" || budgetCustomCategory === normalizedCustomCategory;
    
        // Log for debugging
        console.log(`Comparing: ${budgetCategory} with ${normalizedCategory}, and ${budgetCustomCategory} with ${normalizedCustomCategory}`);
        
        return isSameCategory && isSameCustomCategory;
      });
    
      // If the budget exists, show a toast message and return early
      if (budgetExists) {
        toast({
          title: "Budget Already Exists!",
          description: `A budget for ${category === "Other" ? customCategory : category} already exists. Please edit or delete the existing budget.`,
          variant: "destructive",
        });
        return;  // Exit the function early to avoid making the API call.
      }
      
      const budgetData = {
        userId: user.uid,
        budgetId: "BGT-" + uuidv4(),
        category,
        customCategory: category === "Other" ? customCategory : "",
        amount: parseFloat(amount),
        notes,
        date,
      };
    
      const API_URL = "http://localhost:5000/api/budgets/";
      await axios.post(API_URL, budgetData);
    
      toast({
        title: "Budget Created!",
        description: `Your ${category === "Other" ? customCategory : category} budget has been added.`,
      });
    
      // Reset form fields
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
  }

  useEffect(() => {
    // Fetch budget and log it
    const fetchBudget = async () => {
      
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/budgets/${user.uid}`);
        console.log(response.data);
        setBudgetBook(response.data || []); // Check the structure here
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching budgets:", error);
        toast({
          title: "Fetch Error",
          description: "Could not fetch budget data.",
          variant: "destructive",
        });
      }
      finally {
        setIsLoading(false);
      } 
    };
  
    fetchBudget();
    // eslint-disable-next-line
  }, [user]);

 

  useEffect(() => {
      if (!user) return; // Ensure user is authenticated before fetching
  
      const fetchTransactions = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:5000/api/transactions/${user.uid}`);
          const fetchedTransactions = response.data; // Set the fetched transactions
          setTransactions(fetchedTransactions);
          
        const filteredExpenses = fetchedTransactions.filter(transaction => transaction.type !== 'income');
        setExpenses(filteredExpenses);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching transactions:", error);
        }
        finally {
          setIsLoading(false);
        }
      };
  
      fetchTransactions();
    }, [user]);

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
    const totalAmountSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalAmountRemaining = totalBudgetedAmount - totalAmountSpent;
    const amountSpentPercentage = Math.round((totalAmountSpent / totalBudgetedAmount) * 100);

    const monthlyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const monthlyTransactionData = expenses.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const weeklyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
    
    // Filter transactions for the current week
    const weeklyTransactionData = expenses.filter(item => {
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

    const getRemainingAmount = () => {
      switch (timeRange) {
        case "year":
          return totalAmountRemaining;
        case "month":
          return totalMonthlyRemaining;
        case "week":
          return totalWeeklyRemainingAmount;
        default:
          return 0; // Or however you want to handle undefined time ranges
      }
    };
    
    const remainingAmount = getRemainingAmount();
    
    const getSpentAmountPercent = () => {
      switch (timeRange) {
        case "year":
          return amountSpentPercentage;
        case "month":
          return monthlySpentPercentage;
        case "week":
          return weeklyAmountSpentPercentage;
        default:
          return 0; // Or however you want to handle undefined time ranges
      }
    };
    
    const spentAmountPercentage = getSpentAmountPercent();

    function getLastWeekTransactions(expenses) {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 6); // 6 days before today
      startDate.setHours(0, 0, 0, 0); // Start of the day
  
      const endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999); // End of today
  
      // Filter transactions for the last 7 days (includes today)
      return expenses.filter(item => {
          const itemDate = new Date(item.date); // Assuming item.date is in a valid format
          return itemDate >= startDate && itemDate <= endDate;
      });
  }
  
  // Function to get transactions for the last 6 months
  function getLastSixMonthsTransactions(expenses) {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      
      // Calculate the start date (First day of the month, six months ago)
      startDate.setMonth(currentDate.getMonth() - 5); // Move to 5 months back
      startDate.setDate(1); // Set to the first day of that month
      startDate.setHours(0, 0, 0, 0); // Start of the day
  
      // Calculate the end date (Last day of the current month)
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
      endDate.setDate(0); // Set to the last day of the current month
      endDate.setHours(23, 59, 59, 999); // End of that day
  
      // Filter transactions for the last 6 months (includes the current month)
      return expenses.filter(item => {
          const itemDate = new Date(item.date); // Assuming item.date is in a valid format
          return itemDate >= startDate && itemDate <= endDate;
      });
  }

  function getLastThreeYearsTransactions(expenses) {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    
    // Calculate the start date (First day of the year, three years ago)
    startDate.setFullYear(currentDate.getFullYear() - 3); // Move to three years ago
    startDate.setMonth(0); // Set to January
    startDate.setDate(1); // Set to the first day of January
    startDate.setHours(0, 0, 0, 0); // Start of the day

    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999); // End of today

    return expenses.filter(item => {
        const itemDate = new Date(item.date); // Assuming item.date is in a valid format
        return itemDate >= startDate && itemDate <= endDate;
    });
}
  
  // Get transactions
  const lastWeekTransactions = getLastWeekTransactions(expenses);
  const lastSixMonthsTransactions = getLastSixMonthsTransactions(expenses);
  const lastThreeYearsTransactions = getLastThreeYearsTransactions(expenses);
   // The second parameter is for pretty printing

   console.log("lastThreeYearsTransactions : " + JSON.stringify(lastThreeYearsTransactions, null, 2));

    
    
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
    } //ignore the warning
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [timeRange]);
  

  // Calculate totals
  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const spentPercentage = Math.round((totalSpent / totalBudgeted) * 100);

  const COLORS = ["#6E59A5", "#9b87f5", "#4CAF50", "#F44336", "#2196F3", "#FFC107", "#757575"];

  function processSpendingData(expenses, timeRange) {
    const groupedData = {};

    expenses.forEach(({ amount, category, date }) => {
        const transactionDate = new Date(date);
        let key;

        if (timeRange === "week") {
            key = transactionDate.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.
        } else if (timeRange === "month") {
            key = transactionDate.toLocaleDateString("en-US", { month: "short" }); // "Jan", "Feb", etc.
        } else {
            key = transactionDate.getFullYear().toString(); // "2024", "2025", etc.
        }

        if (!groupedData[key]) {
            groupedData[key] = { name: key, Housing: 0, Food: 0, Utilities: 0, Entertainment: 0, Shopping: 0 };
        }

        // Assign amount to the appropriate category
        if (["Housing"].includes(category)) {
            groupedData[key].Housing += amount;
        } else if (["Food & Dining"].includes(category)) {
            groupedData[key].Food += amount;
        } else if (["Transportation"].includes(category)) {
            groupedData[key].Transportation += amount;
        } else if (["Utilities"].includes(category)) {
            groupedData[key].Utilities += amount;
        } else if (["Entertainment"].includes(category)) {
            groupedData[key].Entertainment += amount;
        } else if (["Shopping"].includes(category)) {
            groupedData[key].Shopping += amount;
        } else {
            groupedData[key].Other += amount;
        }
    });

    return Object.values(groupedData);
}

// Usage Example:
// const timeRange = "month"; // Change based on user selection
const filteredExpenses = getLastSixMonthsTransactions(expenses); // Get transactions
const spendingDataValues = processSpendingData(filteredExpenses, timeRange);


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
        {isLoading ? (
          <Card className="min-h-4/5 py-10">
            <CardHeader>
              <Skeleton className="w-[100px] h-[20px]" />
              <Skeleton className="w-3/5 h-[60px]" />
            </CardHeader>
            <CardContent>
              {/* Skeletons for Actual Content */}
              <div className="flex flex-col items-center justify-center space-y-4 w-full">
                <Skeleton className="w-full h-[20px]" />
                <Skeleton className="w-full h-[50px]" />
                <Skeleton className="w-full h-[20px]" />
              </div>
              <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                <Skeleton className="w-3/5 h-[50px]" />
                <Skeleton className="w-3/5 h-[50px]" />
              </div>
            </CardContent>
          </Card>
        ) : (
        <>
        { budgetBook.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-full pt-24 space-y-4">
            <ChartAreaIcon className="h-12 w-12 text-muted-foreground"/>
            <h1 className="text-lg font-semibold">No Budget found</h1>
            <p className="text-sm text-muted-foreground">Add your first budget to get started.</p>
            <Button onClick={() => setIsNewBudgetDialogOpen(true)} className="flex-shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
          </div>
        )
      :
      (
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
                    <span>GHS {timeRange == "year" ? totalAmountSpent.toLocaleString() : timeRange == "month" ? totalMonthlySpent.toLocaleString() : timeRange == "week" ? totalWeeklySpentAmount.toLocaleString() : null} of GHS {timeRange == "year" ? totalBudgetedAmount.toLocaleString() : timeRange == "month" ? totalMonthlyBudgeted.toLocaleString() : timeRange == "week" ? totalWeeklyBudgetedAmount.toLocaleString() : null}</span>
                  </div>
                  <Progress value={spentAmountPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {remainingAmount >= 0
                      ? `You have $${remainingAmount.toLocaleString()} remaining in your monthly budget`
                      : `You are $${Math.abs(remainingAmount).toLocaleString()} over your monthly budget`}
                  </p>
                </div>

                <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Top Categories</h3>
                    
                    {budgetBook.slice(0, 4).map((budget) => {
                      const filteredExpenses = expenses.filter(transaction => {
                        console.log('Checking expense:', transaction.category);
                        return transaction.category.trim().toLowerCase() === budget.category.trim().toLowerCase();
                      });

                      console.log('Filtered Expenses:', filteredExpenses);

                      const totalSpent = filteredExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
                      console.log('Total Spent for', budget.category, ':', totalSpent);

                      const remaining = budget.amount - totalSpent;
                      const progressValue = budget.amount > 0 ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;

                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{budget.category}</span>
                            <span>${totalSpent.toLocaleString()} of ${budget.amount.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={progressValue} 
                            className={`h-2 ${totalSpent > budget.amount ? 'bg-rose-100' : ''}`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {remaining >= 0
                                ? `$${remaining.toLocaleString()} remaining`
                                : `$${Math.abs(remaining).toLocaleString()} over budget`}
                            </span>
                            <span>{Math.round(progressValue)}%</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("categories")}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View All Categories
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Budget Alerts</h3>
                      <div className="space-y-1">
                      {budgetBook.map(budget => {
                        // Filter expenses for the current budget category
                        const filteredExpenses = expenses.filter(transaction => 
                          transaction.category.trim().toLowerCase() === budget.category.trim().toLowerCase()
                        );

                        // Calculate the total amount spent in this category
                        const totalSpent = filteredExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);

                        // Compare total spent with the budget amount
                        if (totalSpent >= budget.amount) {
                          isOverBudget = true; // Set the flag to true if any budget is over
                          return (
                            <div key={budget.id} className="flex items-center p-3 bg-rose-50 border border-rose-200 rounded-md">
                              <AlertTriangle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {budget.category} is over budget by ${Math.abs(budget.amount - totalSpent)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  You've spent ${totalSpent} of ${budget.amount} budget
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null; // Return null if no alert is needed
                      })}
                      {!isOverBudget && (
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
                      </div>
                    
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
                        {budgetBook.map((budget) => {
                          console.log('Budget Category:', budget.category);
                          
                          const filteredExpenses = expenses.filter(transaction => {
                            console.log('Checking expense:', transaction.category);
                            return transaction.category.trim().toLowerCase() === budget.category.trim().toLowerCase();
                          });

                          console.log('Filtered Expenses:', filteredExpenses);

                          const totalSpent = filteredExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
                          console.log('Total Spent for', budget.category, ':', totalSpent);

                          const remaining = budget.amount - totalSpent;
                          const progressValue = budget.amount > 0 ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;

                          return (
                            <tr key={budget.budgetId} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle font-medium">{budget.category}</td>
                              <td className="p-4 align-middle">${budget.amount.toLocaleString()}</td>
                              <td className="p-4 align-middle">${totalSpent.toLocaleString() || '0'}</td>
                              <td className={`p-4 align-middle font-medium ${
                                remaining < 0 ? 'text-rose-600' : remaining === 0 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {remaining >= 0 
                                  ? `$${remaining.toLocaleString()}` 
                                  : `-$${Math.abs(remaining).toLocaleString()}`}
                              </td>
                              <td className="p-4 align-middle w-[200px]">
                                <div className="flex items-center gap-2">
                                  <Progress 
                                    value={progressValue} 
                                    className={`h-2 flex-grow ${totalSpent > budget.amount ? 'bg-rose-100' : ''}`}
                                  />
                                  <span className="text-xs w-[40px] text-right">
                                    {totalSpent > 0 ? Math.round(progressValue) : '0'}%
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
                          );
                        })}
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
                    data={spendingDataValues}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`GHS ${value}`, 'Amount']} />
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

            <div className="">
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
            )
            
          }
        </>
      )}

        
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
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                <SelectItem value="Personal Care">Personal Care</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Debt Payments">Debt Payments</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Gifts & Donations">Gifts & Donations</SelectItem>
                <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
