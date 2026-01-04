import axios from "axios";
import { AccountType} from  "src/models/user.model";
import env from "src/env"
import oauthGoogleService from "./oauthGoogle.service";

export const getGithubOauthURL = async () => {
   const githubURL  = "https://github.com/login/oauth/authorize"
   const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_REDIRECT_URI,
    scope: "user:email"
   })

   return `${githubURL}?${params.toString()}`
}


// The Backend Performs the steps in function after recieving the code 
export const signinwithGithub = async (code:string) => {
    try{
        // 1. Exchanging code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id:env.GITHUB_CLIENT_ID,
                client_secret:env.GITHUB_SECRET_KEY,
                code:code,
            },
            {
                headers:{Accept: 'application/json'}
            }
        )

        const access_token = tokenResponse.data.access_token;

        // 2. Use Token to get the user data
        const userResponse = await axios.get('http://api.github.com/user',{
            headers: {
                Authorization:`Bearer ${access_token}`
            }
        })

/* UserResponse.data
{
  login: 'Vikalp-Pandey',
  id: 206298285,
  node_id: 'U_kgDODEvcrQ',
  avatar_url: 'https://avatars.githubusercontent.com/u/206298285?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/Vikalp-Pandey',
  html_url: 'https://github.com/Vikalp-Pandey',
  followers_url: 'https://api.github.com/users/Vikalp-Pandey/followers',
  following_url: 'https://api.github.com/users/Vikalp-Pandey/following{/other_user}',
  gists_url: 'https://api.github.com/users/Vikalp-Pandey/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/Vikalp-Pandey/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/Vikalp-Pandey/subscriptions',
  organizations_url: 'https://api.github.com/users/Vikalp-Pandey/orgs',
  repos_url: 'https://api.github.com/users/Vikalp-Pandey/repos',
  events_url: 'https://api.github.com/users/Vikalp-Pandey/events{/privacy}',
  received_events_url: 'https://api.github.com/users/Vikalp-Pandey/received_events',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
  name: 'Vikalp Pandey',
  company: null,
  blog: '',
  location: null,
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  notification_email: null,
  public_repos: 14,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '2025-04-05T04:53:09Z',
  updated_at: '2025-12-12T09:09:09Z'
}

There is no Email.To get the email we need to perform a second api call for user email list
*/
          
        /*
    * To get the email id we need to perform a second api call for email response(as we are getting email:null because of private user)
           
        */

        // 3. Fetch emails separately to handle private email settings
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'User-Agent': 'E-Bucket-App' // Put -App always after the App name
            }
        });

        console.log(emailResponse.data);
        /*
          [
            {
                email: 'vikalp.pandey2004@gmail.com',
                primary: true,
                verified: true,
                visibility: 'public'
            }
        ]
        */ 
        // 4. Find the primary verified email from the array

        const primaryEmailData = emailResponse.data.find(
            (email: 
            {
                email: string,
                primary: boolean,
                verified: boolean,
                visibility:string
            }
             ) => email.primary === true && email.verified === true
        );

        // console.log(userResponse.data);
        // return userResponse.data 
        const userInfo = {
            name: userResponse.data.name,
            email:primaryEmailData.email,
            type: AccountType.GITHUB
        }
        console.log(userInfo);
        
        return userInfo
    }catch(error){
        console.log("Oauth Github Error:",error);  
    }
}


export const getGoogleOauthURL = async ()=>{
       try{

      const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
      
        // State is used to send custom data to google so that it can sent back in the callback route.
        const state = await oauthGoogleService.generateState({user_role:"User"});
        
        const options:Record<string,string> = {
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            client_id: env.GOOGLE_CLIENT_ID,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            // state:state ,
            scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
            ].join(" "),
      };
        if (state){
                options.state = state;
            }
    
      
      const queryString = new URLSearchParams(options).toString();
      const finalURL = `${rootURL}?${queryString}`;
    
      console.log("Generated Google URL:", finalURL);
    
      return finalURL;
       }catch(error){
        console.log(error);
       }
}




interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}


export const signinwithGoogle = async (code:string,userRole:Object)=>{
    const tokenResponse = await axios.post<GoogleTokenResponse>(
         "https://oauth2.googleapis.com/token",
         {
            code,
            client_id:env.GOOGLE_CLIENT_ID,
            client_secret:env.GOOGLE_SECRET_KEY,
            redirect_uri:env.GOOGLE_REDIRECT_URI,
            grant_type:"authorization_code",

         },
         {
            headers:{
                "Content-Type":"application/json",
            }
         }
    )

    const {access_token,refresh_token}=tokenResponse.data

    const userInfo = await axios.get<GoogleUser>(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {headers:{
            Authorization:`Bearer ${access_token}`
        }}
    )
    const user = {
        name: userInfo.data.name,
        email:userInfo.data.email,
        picture:userInfo.data.picture,
        type: AccountType.GOOGLE,
        user_role:userRole
    }

    console.log({
      googleUser: userInfo.data,
      refreshToken: refresh_token, // may be undefined after first login
    });
    
    return user
};

const socialProvidersService = {
    getGithubOauthURL,
    signinwithGithub,
    getGoogleOauthURL,
    signinwithGoogle
}

export default socialProvidersService;

