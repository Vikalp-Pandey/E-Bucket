import { signinSchema, type SigninSchema } from "@/schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth/useauth";
import googleIcon from "@/assets/google-icon.svg";
import facebookIcon from "@/assets/facebook-icon.svg";
import githubIcon from "@/assets/github-icon.png";
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
import { signUser } from "@/hooks/useAuth/authapi";
// import { useQuery } from "@tanstack/react-query";

const SigninForm = () => {
  const { signin } = useAuth();

  // const {error,isError,isLoading,refetch} = useQuery({
  //   queryKey:["github"],
  //   queryFn: ()=> signUser("Github")
  //  })
   
  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SigninSchema) => {
    console.log(data);
    signin.mutate(data);
  };

  const handleClick = ()=>{
    signUser("Github")
  }
  const handleGoogleClick = ()=>{
    signUser("Google")
  }
  

  // if(isError){  
  //   return <div>Failed to show data: {error.message} </div>
  // }
  // if(isLoading){
  //   return <div>Loading ...</div>
  // }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
      <Card className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <p className="text-sm text-gray-400">
            Sign in to your account
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
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

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Google Sign In */}
            <Button
              type="button"
              onClick={handleGoogleClick}
              className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition">
              <img src={googleIcon} alt="google" className="w-5 h-5 " />
              Sign In with Google
            </Button>

            <Button
              type="button"
              className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition">
              <img src={facebookIcon} alt="facebook-icon" className="w-5 h-5 "/>
              Sign In with Facebook
            </Button>
            <Button
              type="button"
              onClick={handleClick}
              className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition">
              <img src={githubIcon} alt="github-icon" className="w-7 h-7" />
              Sign In with Github
            </Button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-white hover:underline cursor-pointer"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninForm;
