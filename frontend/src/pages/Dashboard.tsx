
import { useState } from "react";
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

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Placeholder data for charts and stats
  const accountBalance = 12750.85;
  const monthlyIncome = 5200;
  const monthlyExpenses = 3450.75;
  const savingsGoalProgress = 65;
  
  const recentTransactions = [
    { id: 1, name: "Grocery Store", amount: -125.30, date: "Today", category: "Groceries", icon: <CreditCard size={16} /> },
    { id: 2, name: "Salary Deposit", amount: 2600.00, date: "Yesterday", category: "Income", icon: <DollarSign size={16} /> },
    { id: 3, name: "Electric Bill", amount: -89.99, date: "May 12, 2023", category: "Utilities", icon: <CreditCard size={16} /> },
    { id: 4, name: "Coffee Shop", amount: -4.50, date: "May 11, 2023", category: "Dining", icon: <CreditCard size={16} /> },
    { id: 5, name: "Freelance Payment", amount: 450.00, date: "May 10, 2023", category: "Income", icon: <DollarSign size={16} /> },
  ];

  const spendingByCategory = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 500 },
    { name: "Transportation", value: 300 },
    { name: "Utilities", value: 200 },
    { name: "Entertainment", value: 150 },
    { name: "Other", value: 100 },
  ];

  const monthlyData = [
    { name: "Jan", income: 4800, expenses: 3200 },
    { name: "Feb", income: 4900, expenses: 3100 },
    { name: "Mar", income: 5000, expenses: 3300 },
    { name: "Apr", income: 5100, expenses: 3400 },
    { name: "May", income: 5200, expenses: 3450 },
    { name: "Jun", income: 0, expenses: 0 },
  ];

  const COLORS = ["#6E59A5", "#9b87f5", "#4CAF50", "#F44336", "#2196F3", "#FFC107"];

  // Calculate savings
  const savings = monthlyIncome - monthlyExpenses;
  const savingsPercentage = (savings / monthlyIncome) * 100;

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
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
              <div className="flex items-center text-xs text-emerald-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+3.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyExpenses.toLocaleString()}</div>
              <div className="flex items-center text-xs text-rose-500">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                <span>+2.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
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
              <CardDescription>Your financial activity for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
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
              <CardDescription>Where your money went this month</CardDescription>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Housing</span>
                    <span>$1,200 / $1,200</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Food & Dining</span>
                    <span>$500 / $600</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Transportation</span>
                    <span>$300 / $350</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Entertainment</span>
                    <span>$150 / $200</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
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
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${transaction.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {transaction.icon}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
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
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Emergency Fund</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$6,500 saved</span>
                  <span>$10,000 goal</span>
                </div>
                <Progress value={65} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">65% complete • Est. completion: Oct 2023</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Vacation</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$1,200 saved</span>
                  <span>$3,000 goal</span>
                </div>
                <Progress value={40} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">40% complete • Est. completion: Dec 2023</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">New Car</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>$4,500 saved</span>
                  <span>$15,000 goal</span>
                </div>
                <Progress value={30} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">30% complete • Est. completion: Mar 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
