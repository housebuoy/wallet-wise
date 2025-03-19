
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BankConnection } from "@/components/BankConnection";
import { savingsGoalsService, SavingsGoal, CreateSavingsGoalParams } from "@/services/savingsGoalsService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, DollarSign, PiggyBank, Plus, Target, Trash2, TrendingUp } from "lucide-react";

const SavingsGoals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [bankConnectionOpen, setBankConnectionOpen] = useState(false);
  
  // Form states
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");

  // Fetch savings goals
  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: savingsGoalsService.getAllGoals,
    enabled: !!user,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: savingsGoalsService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      resetForm();
      setNewGoalOpen(false);
    }
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => savingsGoalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Goal deleted",
        description: "Your savings goal has been deleted successfully."
      });
    }
  });

  // Contribute to goal mutation
  const contributeToGoalMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string, amount: number }) => 
      savingsGoalsService.contributeToGoal(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      setContributionOpen(false);
      setContributionAmount("");
    }
  });

  const resetForm = () => {
    setGoalName("");
    setTargetAmount("");
    setInitialAmount("");
    setTargetDate("");
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount) {
      toast({
        title: "Missing information",
        description: "Please provide a name and target amount for your goal.",
        variant: "destructive"
      });
      return;
    }

    const newGoal: CreateSavingsGoalParams = {
      name: goalName,
      target_amount: parseFloat(targetAmount),
      current_amount: initialAmount ? parseFloat(initialAmount) : 0,
      target_date: targetDate || null
    };

    createGoalMutation.mutate(newGoal);
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !contributionAmount) {
      toast({
        title: "Missing information",
        description: "Please select a goal and enter a contribution amount.",
        variant: "destructive"
      });
      return;
    }

    contributeToGoalMutation.mutate({
      id: selectedGoal.id,
      amount: parseFloat(contributionAmount)
    });
  };

  const openContributionDialog = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setContributionOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
            <p className="text-muted-foreground">Track and manage your financial objectives</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setNewGoalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
            <Button variant="outline" onClick={() => setBankConnectionOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Connect Bank
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <p className="text-red-500">Error loading savings goals.</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['savingsGoals'] })}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : goals.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <PiggyBank className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Savings Goals Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2 mb-6">
                Create your first savings goal to start tracking your progress toward financial success.
              </p>
              <Button onClick={() => setNewGoalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = goal.target_amount > 0 
                ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100) 
                : 0;
              
              return (
                <Card key={goal.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span className="truncate mr-2">{goal.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                      ${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      {goal.target_date && (
                        <>
                          <span className="mx-1">•</span>
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(goal.target_date).toLocaleDateString()}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>${goal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      onClick={() => openContributionDialog(goal)}
                      className="w-full"
                      variant="outline"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Add Funds
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
            <DialogDescription>
              Set up a new goal to help you save for something important.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGoal}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input 
                  id="goal-name" 
                  placeholder="e.g., Emergency Fund, Vacation" 
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount ($)</Label>
                <Input 
                  id="target-amount" 
                  type="number" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initial-amount">Initial Amount ($) (Optional)</Label>
                <Input 
                  id="initial-amount" 
                  type="number" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-date">Target Date (Optional)</Label>
                <Input 
                  id="target-date" 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewGoalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createGoalMutation.isPending}>
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribution Dialog */}
      <Dialog open={contributionOpen} onOpenChange={setContributionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds to Goal</DialogTitle>
            <DialogDescription>
              {selectedGoal && `Contribute to your "${selectedGoal.name}" savings goal.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContribute}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="contribution-amount">Amount ($)</Label>
                <Input 
                  id="contribution-amount" 
                  type="number" 
                  placeholder="0.00" 
                  min="0.01" 
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                />
              </div>
              {selectedGoal && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Current balance:</span>
                    <span>${selectedGoal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Target amount:</span>
                    <span>${selectedGoal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Remaining:</span>
                    <span>${(selectedGoal.target_amount - selectedGoal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContributionOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={contributeToGoalMutation.isPending || !contributionAmount || parseFloat(contributionAmount) <= 0}
              >
                {contributeToGoalMutation.isPending ? "Processing..." : "Add Funds"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bank Connection Dialog */}
      <Dialog open={bankConnectionOpen} onOpenChange={setBankConnectionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect Your Bank</DialogTitle>
            <DialogDescription>
              Link your bank accounts to track your finances and fund your savings goals automatically.
            </DialogDescription>
          </DialogHeader>
          <BankConnection />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SavingsGoals;
