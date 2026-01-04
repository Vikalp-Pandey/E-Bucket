import { useMutation } from "@tanstack/react-query"
import type { ForgotPasswordSchema, SigninSchema, SignupSchema } from "../../schema/auth.schema"
import { postUser, sendMailandOtpForOtpVerification, sendMailForResetPassword, sendTokenandPassword, type payloadSchema } from "./authapi"
import { useNavigate } from "react-router"
import { toast } from "react-toastify";


export const useAuth = () => {
    const navigate = useNavigate()
    // signup Mutation
    const signupMutation = useMutation({
          mutationFn: (input: SignupSchema ) => postUser(input, "signup"),
          onSuccess: (data) => {
            
            console.log("Signup Successful",data)
            alert("Signed Up Successfully")
            navigate("/signin")
          },
          onError:(error) =>{ 
            console.error("Signup Error:", error.message)
            alert(`SignUpError:${error.message}`)
           }
    });
    
    const signinMutation = useMutation({
        mutationFn: (input:SigninSchema) => postUser(input,"signin"),
        onSuccess: (data) => {
            console.log("Signin Successful",data);
            alert("Signed In Successfully");
            // sendMailandOtpForOtpVerification(data.email)
            navigate("/verify-otp");
          },
        onError:(error) =>{ 
            console.error("Signup Error:", error.message)

            alert(`SignUpError:${error.message}`)
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: (input:string) => sendMailandOtpForOtpVerification(input),
        onSuccess: (data) => {
            console.log("Otp Verified Successfully",data);
            navigate("/")
            // alert("Signed In Successfully");
          },
        onError:(error) =>{ 
            console.error("OtpVerifcationError:", error.message)

            alert(`Invalid Otp`)
        }
    })

    const forgotPasswordMutation = useMutation({
      mutationFn: (input:ForgotPasswordSchema) => sendMailForResetPassword(input.email),
      onSuccess: () => {
        toast.success("A Link has been sent to your Email for reset password.")
        alert("A Link has been sent to your Email for reset password.")
        // console.log("Password is Reseted Successfully");
        
      },
      onError:(error) =>{ 
            console.error("PasswordResetError:", error.message)
            alert(`PasswordResetError:${error.message}`)
        }
    })

    const resetPasswordMutation = useMutation({
      mutationFn: (data:payloadSchema)=> sendTokenandPassword(data),
      onSuccess: ()=>{
        alert("Password changed successfully")
        navigate("/")
      }
    })

    // const singinwithGithubMutation = useMutation({
    //   mutationFn: ()=> signUser("Github"),
    //   onSuccess:()=>{
    //     console.log("Sign in with Github")
    //     alert("Signed in with Github Successfully")
    //     navigate("/")
    //   },
    //   onError:(error)=>{
    //     alert(`Github SignIn Error: ${error.message}`)
    //   }
    // })
    return {
        signup:signupMutation,
        signin:signinMutation,
        verifyOtp:verifyOtpMutation,
        forgotPassword:forgotPasswordMutation,
        resetPassword:resetPasswordMutation,
    }
}