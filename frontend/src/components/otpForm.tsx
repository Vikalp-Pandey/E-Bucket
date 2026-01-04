import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";

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
import { otpSchema, type OtpSchema } from "@/schema/auth.schema";
import { useAuth } from "@/hooks/useAuth/useauth";


const OtpForm = () => {
  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { verifyOtp } = useAuth();
  const onSubmit = (data: OtpSchema) => {
    console.log("OTP submitted:", data);
    verifyOtp.mutate(data.otp)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
      <Card className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Verify OTP
          </CardTitle>
          <p className="text-sm text-gray-400">
            We’ve sent a 6-digit verification code to your email
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-5 rounded-lg bg-white/10 p-4 text-sm text-gray-300">
            <p>
              🔐 <span className="font-medium text-white">Why am I seeing this?</span>
            </p>
            <p className="mt-1">
              For security reasons, we need to verify your identity.
              An OTP has been sent to:
            </p>
            <p className="mt-2 font-semibold text-white">
              vik***@gmail.com
            </p>
            <p className="mt-1 text-xs text-gray-400">
              This code will expire in 5 minutes.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* OTP Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Enter OTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        className="text-center tracking-widest text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl cursor-pointer bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                Verify OTP
              </Button>

              {/* Resend */}
              <div className="text-center text-sm text-gray-400">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  className="text-white hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500">
                Entered the wrong email?{" "}
                <Link
                  to="/signin"
                  className="text-white hover:underline"
                >
                  Go back
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpForm;
