import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Building, CreditCard, ShieldCheck } from "lucide-react";
import { auth } from "@/firebaseConfig"; // Assuming you have configured Firebase in this file.

export function BankConnection() {
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankType, setBankType] = useState("checking");
  const [step, setStep] = useState(1);
  const [connected, setConnected] = useState(false);

  // Fetch user information from Firebase authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to connect your bank account",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Prepare connection data
      const connectionData = {
        bank_name: bankName,
        bank_type: bankType,
        user_id: user.uid,
        createdAt: new Date(),
      };

      // Make a POST request to your backend API to save connection data to MongoDB
      const response = await fetch("/api/bank-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        throw new Error('Failed to connect bank'); // Handle any errors from the response
      }

      toast({
        title: "Bank connected successfully",
        description: `You've successfully connected to ${bankName}`,
      });
      setConnected(true);
    } catch (error) {
      console.error("Error connecting bank:", error);
      toast({
        title: "Connection failed",
        description: "There was a problem connecting to your bank. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Connect Your Bank
        </CardTitle>
        <CardDescription>
          Link your bank accounts to automatically track your finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-4 text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-md flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              <span>Bank account successfully connected!</span>
            </div>
            <p>You can now track transactions and set up automatic transfers to your savings goals.</p>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input 
                id="bank-name" 
                placeholder="Enter your bank name" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select value={bankType} onValueChange={setBankType}>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 flex items-start">
              <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Your banking information is encrypted and secure. We use bank-level security to protect your data.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Bank Username</Label>
              <Input id="username" placeholder="Username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Bank Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-700">
              <p>Note: This is a demo. In a real app, you would be redirected to your bank's secure login page.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 && !connected && (
          <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        )}
        {!connected && (
          <Button 
            className={step === 1 ? "ml-auto" : ""}
            disabled={isConnecting || (step === 1 && !bankName)}
            onClick={() => {
              if (step === 1) {
                setStep(2);
              } else {
                handleConnect();
              }
            }}
          >
            {isConnecting ? "Connecting..." : step === 1 ? "Next" : "Connect Bank"}
          </Button>
        )}
        {connected && (
          <Button 
            className="ml-auto"
            onClick={() => {
              setConnected(false);
              setStep(1);
              setBankName("");
              setBankType("checking");
            }}
          >
            Connect Another Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}