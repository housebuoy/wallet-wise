
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, Plus, DollarSign, CreditCard, Wallet, BarChart3, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("month");
  const [accountBalance, setAccountBalance] = useState(12750.85);
  const [savings, setSavings] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [budgetBook, setBudgetBook] = useState([])
  const auth = useContext(AuthContext);
  const {user} = auth



  useEffect(() => {
    if (!user) return; // Ensure user is authenticated before fetching

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transactions/${user.uid}`);
        const fetchedTransactions = response.data; // Set the fetched transactions
        setTransactions(fetchedTransactions);
      
      const filteredExpenses = fetchedTransactions.filter(transaction => transaction.type !== 'income');
      setExpenses(filteredExpenses);

      const filteredIncome = fetchedTransactions.filter(transaction => transaction.type === 'income');
      setIncome(filteredIncome);
      console.log(JSON.stringify(income))
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
    //eslint-disable-next-line
  }, [user]);

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
    // eslint-disable-next-line
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

    const weeklyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });

    const monthlyBudgetedData = budgetBook.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const totalBudgetedAmount = budgetBook.reduce((sum, item) => sum + item.amount, 0);

    const totalWeeklyBudgetedAmount = weeklyBudgetedData.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlyBudgeted = monthlyBudgetedData.reduce((sum, item) => sum + item.amount, 0);
    const totalBudgetAmount   = income.reduce((sum, item) => sum + item.amount, 0);



    const monthlyTransactionData = expenses.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    const monthlyIncomeData = income.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    })

    console.log(monthlyIncomeData)

    const weeklyIncome = income.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
    
    // Filter transactions for the current week
    const weeklyTransactionData = expenses.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
    
    // Calculate totals for the current week
    const totalIncomeAmount   = income.reduce((sum, item) => sum + item.amount, 0);
    const totalWeeklyIncome   = weeklyIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalWeeklySpentAmount = weeklyTransactionData.reduce((sum, item) => sum + item.amount, 0);
    // const totalWeeklyRemainingAmount = totalWeeklyBudgetedAmount - totalWeeklySpentAmount;
    // const weeklyAmountSpentPercentage = totalWeeklyBudgetedAmount > 0 ? Math.round((totalWeeklySpentAmount / totalWeeklyBudgetedAmount) * 100) : 0;

    // console.log(totalMonthlySpent)
// 
    const totalMonthlyIncome = monthlyIncomeData.reduce((sum, item) => sum + item.amount, 0);
    const totalMonthlySpent = monthlyTransactionData.reduce((sum, item) => sum + item.amount, 0);
    // const totalMonthlyRemaining = totalMonthlyBudgeted - totalMonthlySpent;
    // const monthlySpentPercentage = Math.round((totalMonthlySpent / totalMonthlyBudgeted) * 100);

    const getTotalIncome = () => {
      switch (timeRange) {
        case "year":
          return totalIncomeAmount;
        case "month":
          return totalMonthlyIncome;
        case "week":
          return totalWeeklyIncome;
        default:
          return 0; // Or however you want to handle undefined time ranges
      }
    };
    
    const totalIncome = getTotalIncome();

    const getTotalBudget = () => {
      switch (timeRange) {
        case "year":
          return totalIncomeAmount;
        case "month":
          return totalMonthlyIncome;
        case "week":
          return totalWeeklyIncome;
        default:
          return 0; // Or however you want to handle undefined time ranges
      }
    };
    
    const totalBudget = getTotalBudget();
    
    // const getSpentAmountPercent = () => {
    //   switch (timeRange) {
    //     case "year":
    //       return amountSpentPercentage;
    //     case "month":
    //       return monthlySpentPercentage;
    //     case "week":
    //       return weeklyAmountSpentPercentage;
    //     default:
    //       return 0; // Or however you want to handle undefined time ranges
    //   }
    // };
    
    // const spentAmountPercentage = getSpentAmountPercent();

    const getExpenses = () => {
      switch (timeRange) {
        case "year":
          return totalMonthlySpent;
        case "month":
          return totalMonthlySpent;
        case "week":
          return totalWeeklySpentAmount;
        default:
          return 0; // Or however you want to handle undefined time ranges
      }
    };
    const totalExpenses = getExpenses();
  
  // Sample data sets for different time ranges
  const weekData = [
    { name: "Mon", income: 1200, expenses: 800 },
    { name: "Tue", income: 900, expenses: 600 },
    { name: "Wed", income: 1500, expenses: 950 },
    { name: "Thu", income: 800, expenses: 700 },
    { name: "Fri", income: 1100, expenses: 850 },
    { name: "Sat", income: 300, expenses: 400 },
    { name: "Sun", income: 200, expenses: 350 },
  ];
  
  const monthData = [
    { name: "Jan", income: 4800, expenses: 3200 },
    { name: "Feb", income: 4900, expenses: 3100 },
    { name: "Mar", income: 5000, expenses: 3300 },
    { name: "Apr", income: 5100, expenses: 3400 },
    { name: "May", income: 5200, expenses: 3450 },
    { name: "Jun", income: 0, expenses: 0 },
  ];
  
  const yearData = [
    { name: "Jan", income: 4800, expenses: 3200 },
    { name: "Feb", income: 4900, expenses: 3100 },
    { name: "Mar", income: 5000, expenses: 3300 },
    { name: "Apr", income: 5100, expenses: 3400 },
    { name: "May", income: 5200, expenses: 3450 },
    { name: "Jun", income: 5300, expenses: 3500 },
    { name: "Jul", income: 5400, expenses: 3600 },
    { name: "Aug", income: 5500, expenses: 3650 },
    { name: "Sep", income: 5600, expenses: 3700 },
    { name: "Oct", income: 5700, expenses: 3800 },
    { name: "Nov", income: 5800, expenses: 3900 },
    { name: "Dec", income: 6000, expenses: 4000 },
  ];
  
  const recentTransactions = [
    { id: 1, name: "Grocery Store", amount: -125.30, date: "Today", category: "Groceries", icon: <CreditCard size={16} /> },
    { id: 2, name: "Salary Deposit", amount: 2600.00, date: "Yesterday", category: "Income", icon: <DollarSign size={16} /> },
    { id: 3, name: "Electric Bill", amount: -89.99, date: "May 12, 2023", category: "Utilities", icon: <CreditCard size={16} /> },
    { id: 4, name: "Coffee Shop", amount: -4.50, date: "May 11, 2023", category: "Dining", icon: <CreditCard size={16} /> },
    { id: 5, name: "Freelance Payment", amount: 450.00, date: "May 10, 2023", category: "Income", icon: <DollarSign size={16} /> },
  ];

  const weeklySpendingByCategory = [
    { name: "Housing", value: 350 },
    { name: "Food", value: 200 },
    { name: "Transportation", value: 100 },
    { name: "Utilities", value: 70 },
    { name: "Entertainment", value: 80 },
    { name: "Other", value: 50 },
  ];
  
  const monthlySpendingByCategory = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 500 },
    { name: "Transportation", value: 300 },
    { name: "Utilities", value: 200 },
    { name: "Entertainment", value: 150 },
    { name: "Other", value: 100 },
  ];
  
  const yearlySpendingByCategory = [
    { name: "Housing", value: 14400 },
    { name: "Food", value: 6000 },
    { name: "Transportation", value: 3600 },
    { name: "Utilities", value: 2400 },
    { name: "Entertainment", value: 1800 },
    { name: "Other", value: 1200 },
  ];

  const COLORS = ["#6E59A5", "#9b87f5", "#4CAF50", "#F44336", "#2196F3", "#FFC107"];

  // Update data based on time range
  useEffect(() => {
    let data;
    let spending;
    let income = 0;
    let expenses = 0;
    
    switch(timeRange) {
      case "week":
        data = weekData;
        spending = weeklySpendingByCategory;
        income = 5100;
        expenses = 3350;
        break;
      case "month":
        data = monthData;
        spending = monthlySpendingByCategory;
        income = 5200;
        expenses = 3450.75;
        break;
      case "year":
        data = yearData;
        spending = yearlySpendingByCategory;
        income = 62300;
        expenses = 42600;
        break;
      default:
        data = monthData;
        spending = monthlySpendingByCategory;
        income = 5200;
        expenses = 3450.75;
    }
    
    setChartData(data);
    setSpendingByCategory(spending)
    // Calculate savings
    const newSavings = income - expenses;
    setSavings(newSavings);
    setSavingsPercentage((newSavings / income) * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);




  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${accountBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total across all accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Annual"} Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
              <div className="flex items-center text-xs text-emerald-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+3.2% from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Annual"} Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {totalExpenses.toLocaleString()}</div>
              <div className="flex items-center text-xs text-rose-500">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                <span>+2.5% from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Annual"} Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${savings.toLocaleString()}</div>
              <div className="flex items-center text-xs">
                <span>{savingsPercentage.toFixed(1)}% of income</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>
                Your financial activity for {
                  timeRange === "week" ? "this week" : 
                  timeRange === "month" ? "the past 6 months" : 
                  "this year"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar name="Income" dataKey="income" fill="#6E59A5" />
                  <Bar name="Expenses" dataKey="expenses" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Where your money went this {
                  timeRange === "week" ? "week" : 
                  timeRange === "month" ? "month" : 
                  "year"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress and Recent Transactions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Budget Progress</CardTitle>
              <CardDescription>Your spending against monthly budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View All Budgets
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.transactionId} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${transaction.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {transaction.icon}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <span className={`${transaction.amount > 0 ? 'text-emerald-600' : 'text-rose-600'} font-medium`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Savings Goals</CardTitle>
                <CardDescription>Track your progress towards financial goals</CardDescription>
              </div>
              <Link to="/savings-goals">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link to="/savings-goals" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold mb-1">Emergency Fund</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$6,500 saved</span>
                  <span>$10,000 goal</span>
                </div>
                <Progress value={65} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">65% complete • Est. completion: Oct 2023</p>
              </Link>
              <Link to="/savings-goals" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold mb-1">Vacation</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$1,200 saved</span>
                  <span>$3,000 goal</span>
                </div>
                <Progress value={40} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">40% complete • Est. completion: Dec 2023</p>
              </Link>
              <Link to="/savings-goals" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold mb-1">New Car</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$4,500 saved</span>
                  <span>$15,000 goal</span>
                </div>
                <Progress value={30} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">30% complete • Est. completion: Mar 2024</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
