
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LockKeyhole, Mail, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { auth, googleProvider, githubAuthProvider } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, getIdToken  } from "firebase/auth"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
  
    const API_URL = "https://wallet-wise-x7ih.onrender.com/api/users";
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const userId = await getIdToken(userCredential.user);
      const email = userCredential.user.email;
      const name = values.name;
  
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: values.name,
      });
      
      console.log("Data being sent to API:", {
        userId,
        name,
        email,
      });
      
      await axios.post(API_URL, {
        userId,
        name,
        email,
      });
  
      console.log("User successfully signed up & stored in DB!");
  
      toast({
        title: "Account created!",
        description: "Welcome to WalletWise. You can now log in.",
      });
  
      // Redirect after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "There was a problem creating your account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
      setIsLoading(true);
    
      try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        const userData = {
          userId: user.uid,
          name: user.displayName || "No Name",
          email: user.email,
          phoneNumber: user.phoneNumber || "",
        };

        await axios.post("https://wallet-wise-x7ih.onrender.com/api/users", userData);
    
        console.log("Google Signup User:", user);
    
        toast({
          title: "Account created!",
          description: `Welcome, ${user.displayName}! You have successfully signed up.`,
        });
    
        // Redirect to dashboard or login after signup
        navigate("/dashboard");
      } catch (error) {
        console.error("Google Signup Error:", error);
        toast({
          variant: "destructive",
          title: "Google Signup Failed",
          description: error.message || "An error occurred while signing up with Google.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    async function handleGitHubSignup() {
      try {
        const userCredential = await signInWithPopup(auth, githubAuthProvider);
        const user = userCredential.user;
        console.log("User Info:", user);

        const userData = {
          userId: user.uid,
          name: user.displayName || "GitHub User",
          email: user.email,
          phoneNumber: user.phoneNumber || "", 
        };

        await axios.post("https://wallet-wise-x7ih.onrender.com/api/users", userData);

        toast({
          title: "Welcome!",
          description: `Signed in as ${user.displayName || user.email}`,
        });
    
        navigate("/dashboard"); // Redirect to dashboard after login
      } catch (error) {
        console.error("GitHub Sign-In Error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message || "Unable to sign in with GitHub.",
        });
      }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create your WalletWise account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="grid gap-1.5 leading-none">
                      <FormLabel className="text-sm cursor-pointer">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="font-medium text-primary hover:underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="font-medium text-primary hover:underline"
                        >
                          privacy policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={handleGoogleSignup} disabled={isLoading}>
                Google
              </Button>
              <Button variant="outline" type="button" onClick={handleGitHubSignup} disabled={isLoading}>
                Github
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
