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
import { PiggyBank, Plus, Trash2, TrendingUp } from "lucide-react";
import { CgPushChevronRightR } from "react-icons/cg";
// import { savingsGoalsService } from "@/services/savingsGoalsService";

const SavingsGoals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // const createGoalMutation = useMutation({
  //     mutationFn: (data: { goal: { name: string; targetAmount: number; currentAmount: number }; userId: string }) =>
  //       savingsGoalsService.createGoal(data.goal, data.userId),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['savingsGoals']);
  //       setNewGoalOpen(false);
  //       setGoalName("");
  //       setTargetAmount("");
  //       setInitialAmount("");
  //     },
  //   });

  // const deleteGoalMutation = useMutation({
  //   mutationFn: savingsGoalsService.deleteGoal,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['savingsGoals']);
  //     toast({ title: "Goal deleted", description: "Your savings goal was removed." });
  //   },
  // });

  // const handleCreateGoal = (e) => {
  //   e.preventDefault();
  //   createGoalMutation.mutate({
  //     userId: user.uid,
  //     name: goalName,
  //     targetAmount: parseFloat(targetAmount),
  //     currentAmount: initialAmount ? parseFloat(initialAmount) : 0,
  //   });
  // };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <Button onClick={() => setNewGoalOpen(true)}>
            <Plus className="mr-2" /> New Goal
          </Button>
        </div>

        {isLoading ? <p>Loading...</p> : error ? <p>Error loading goals</p> : goals.length === 0 ? (
          <div className="text-center mt-6">
            <PiggyBank className="h-16 w-16 mx-auto" />
            <p>No savings goals yet.</p>
          </div>
        ) : (
          <div className="">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Income
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GHS</div>
                    <div className="flex items-center text-xs text-emerald-500">
                    </div>
                  </CardContent>
                </Card>
            </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {goals.map((goal) => (
              <Card key={goal._id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>Target: GHS {goal.targetAmount.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
                  <p className="text-xs font-medium text-[#6f5aa6]">Saved: GHS{goal.currentAmount.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" >
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
          <form >
            <Label>Name</Label>
            <Input value={goalName} onChange={(e) => setGoalName(e.target.value)} required />
            <Label>Target Amount ($)</Label>
            <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
            <Label>Initial Amount ($) (Optional)</Label>
            <Input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} />
            <DialogFooter>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SavingsGoals;
