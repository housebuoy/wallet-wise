import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";
import { PiggyBank, PiggyBankIcon, Plus, Trash2, TrendingUp } from "lucide-react";
import { CgPushChevronRightR } from "react-icons/cg";
import { FaSackDollar } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "@/components/ui/skeleton"

import axios from "axios";

const SavingsGoals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [date, setDate] = useState("");
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [allocationOpen, setAllocationOpen] = useState(false);
  const [allocationAmount, setAllocationAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const dummyGoals = [
    { _id: 'goal1', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1500 },
    { _id: 'goal2', name: 'Vacation Fund', targetAmount: 3000, currentAmount: 750 },
    { _id: 'goal3', name: 'Home Renovation', targetAmount: 20000, currentAmount: 5000 },
    { _id: 'goal4', name: 'New Car', targetAmount: 25000, currentAmount: 12000 },
    { _id: 'goal5', name: 'Wedding Fund', targetAmount: 10000, currentAmount: 2000 },
  ];

  useEffect(() => {
    // Simulating a data fetch with dummy data
    setTimeout(() => {
      setGoals(dummyGoals);
      setIsLoading(false);
    }, 500); // Mock an API call with a slight delay
  }, );

  useEffect(() => {
      if (!user) return; // Ensure user is authenticated before fetching
  
      const fetchSavingGoals = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`https://wallet-wise-x7ih.onrender.com/api/savings/${user.uid}`);
          setSavingGoals(response.data); // Set the fetched transactions
          console.log("Fetched savings:", response.data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setIsLoading(false);
        }
        finally {
          setIsLoading(false);
        } 
      };
  
      fetchSavingGoals();
    }, [user]);

  const submitSavingGoal = async () => {
    if (!user || !user.uid) {
      alert("User not authenticated!");
      return;
    }
  
    const savingGoalData = {
      userId: user.uid,
      savingGoalId: "SVN-" + uuidv4(),
      goalName: goalName,
      targetAmount: parseFloat(targetAmount),
      initialAmount: parseFloat(initialAmount),
      date: date,
    };
  
    console.log("Saving Data to be sent:", savingGoalData);
  
    try {
      const API_URL = "https://wallet-wise-x7ih.onrender.com/api/savings";
      const response = await axios.post(API_URL, savingGoalData, {
        headers: {
          'Content-Type': 'application/json' // Set content type
        }
      });
  
      console.log("Response from server:", response.data);
      toast({
        title: "Saving Goal Created!",
        description: `Your Saving Goal was added successfully!`,
      });
      setNewGoalOpen(false);
    } catch (error) {
      console.error("Error adding saving goal:", error);
      if (error.response) {
        console.log("Response data:", error.response.data); // Log specifics of the error response
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.response.data.message || "Your Saving Goal wasn't created. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.message || "Your Saving Goal wasn't created. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    if (!user) return; // Ensure user is authenticated before fetching

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://wallet-wise-x7ih.onrender.com/api/transactions/${user.uid}`);
        setTransactions(response.data); 
        console.log("Fetched transactions:", response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  function resetForm() {
    setAllocationAmount("");
    setSelectedGoalId(null);
  }

  const getUpdatedAmount = (initialAmount, allocationAmount) => {
    return allocationAmount > 0 ? parseFloat(allocationAmount) : initialAmount + parseFloat(allocationAmount);
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedGoalId) return; // Ensure a goal is selected
  
    const updatedAmount = getUpdatedAmount(initialAmount, allocationAmount); 
  
    const allocationData = {
      initialAmount: updatedAmount,  // This might need clarification; otherwise, we focus on allocation
      allocationAmount: parseFloat(allocationAmount), // Ensure allocationAmount is sent
    };
    
    try {
      const response = await axios.put(`https://wallet-wise-x7ih.onrender.com/api/savings/${selectedGoalId}`, allocationData);
      toast({
        title: "Funds Allocated!",
        description: `You have successfully allocated funds to the goal.`,
      });
      setAllocationOpen(false);
      resetForm();
    } catch (error) {
      if (error.response) {
        console.log("Response data:", error.response.data);
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.response.data.message || "Your Saving Goal wasn't created. Please try again.",
        });
      }
    }
  };

  // Filter transactions for only savings category
  const savingsTransactions = transactions.filter((txn) => txn.category === "Savings");

  // Calculate total savings amount
  const totalSavings = savingsTransactions.reduce((acc, txn) => acc + txn.amount, 0);
  const totalAllocated = savingGoals.reduce((acc, goal) => acc + goal.initialAmount, 0);
  const savingsRemaining = totalSavings - totalAllocated;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <Button onClick={() => setNewGoalOpen(true)}>
            <Plus className="mr-2" /> New Goal
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ) : error ? <p>Error loading goals</p> : goals.length === 0 ? (
          <div className="text-center mt-6">
            <PiggyBank className="h-16 w-16 mx-auto" />
            <p>No savings goals yet.</p>
          </div>
        ) : (
          <div className="">
            <div className="w-full bg-yellow-200 mt-5 p-2 font-semibold text-slate-500 rounded-md flex items-center justify-center">
              <p>NB: Savings Goals can only be created if there is some deposits from transactions with the category 'Services'</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings Deposit
                    </CardTitle>
                    <PiggyBank className="h-6 w-6 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GHS {totalSavings}</div>
                    <div className="flex items-center text-xs text-emerald-500">
                    </div>
                  </CardContent>
                </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings Allocated
                    </CardTitle>
                    <CgPushChevronRightR className="h-6 w-6 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GHS {totalAllocated}</div>
                    <div className="flex items-center text-xs text-emerald-500">
                    </div>
                  </CardContent>
                </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings Remains
                    </CardTitle>
                    <FaSackDollar  className="h-6 w-6 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GHS {savingsRemaining}</div>
                    <div className="flex items-center text-xs text-emerald-500">
                    </div>
                  </CardContent>
                </Card>                
            </div>
            {
              savingGoals.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full min-h-full pt-24 space-y-4">
                  <PiggyBankIcon className="h-12 w-12 text-muted-foreground"/>
                  <h1 className="text-lg font-semibold">No Saving Goal found</h1>
                  <p className="text-sm text-muted-foreground">Add your first saving goal to get started.</p>
                  <Button onClick={() => setNewGoalOpen(true)} className="flex-shrink-0">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                </div>
              ) 
            }
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {savingGoals.map((goal) => (
              <Card key={goal?._id}>
                <CardHeader>
                  <CardTitle>{goal.goalName}</CardTitle>
                  <CardDescription>Target: GHS {goal.targetAmount?.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(goal.initialAmount / goal.targetAmount) * 100} />
                  <p className="text-xs font-medium text-[#6f5aa6]">Saved: GHS{goal.initialAmount?.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" onClick={() => {
                    setSelectedGoalId(goal.savingGoalId); // Store the goal id to allocate funds
                    setAllocationOpen(true); // Open the allocation dialog
                  }}>
                    <CgPushChevronRightR className="mr-2" /> Allocate
                  </Button>
                  <Button variant="outline" className="hover:bg-red-200" >
                    <Trash2 className="mr-2" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          </div>
        )}
      </div>

      <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Savings Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitSavingGoal}>
            <Label>Name</Label>
            <Input value={goalName} onChange={(e) => setGoalName(e.target.value)} required />
            <Label>Target Amount (GHS)</Label>
            <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
            <Label>Initial Amount (GHS) (Optional)</Label>
            <Input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} />
            <div className="w-full">
              <Label htmlFor="date">Date Due</Label>
              <Input id="date" className="w-full" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewGoalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={allocationOpen} onOpenChange={setAllocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Funds</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAllocate}>
            <Label>Amount to Allocate (GHS)</Label>
            <Input type="number" value={allocationAmount} onChange={(e) => setAllocationAmount(e.target.value)} required />
            <DialogFooter>
              <Button variant="outline" onClick={() => setAllocationOpen(false)}>Cancel</Button>
              <Button type="submit">Allocate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};


export default SavingsGoals;


