import { signupSchema, type SignupSchema } from "@/schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth/useauth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const SignupForm = () => {
  const { signup } = useAuth();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  
  const onSubmit = (data: SignupSchema) => {
    console.log(data);
    // We can also provide the neccessary redirects, steps ... that should be executed on onSuccess at
    
    // signup.mutate(data,{onSuccess: (data)=> navigate("/signin")}); 
    signup.mutate(data); 
  };

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
    <Card className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-white">
          Create an account
        </CardTitle>
        <p className="text-sm text-gray-400">
          Enter your details to get started
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition "
            >
              Sign Up
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-400">
                OR
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            

            {/* Footer */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-white hover:underline cursor-pointer">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
);

};

export default SignupForm;
