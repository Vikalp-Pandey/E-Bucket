import socialProvidersService from "src/services/auth/oauth.service";
import {Request,Response} from "express";
import userService from "src/services/users/user.service";
import env from "src/env";


export const getGithubURL = async (req:Request,res:Response) => {
    try{
       // 1. First we have to get the code by calling the github url with given credentials like client_id,secret,redirect_uri
        // This will be done by calling getGithubUrl route
        const githubURL = await socialProvidersService.getGithubOauthURL();
        console.log(githubURL);
        
        // 2. Redirect some incoming request (from frontend) to github url where it will redirect to callbackurl
        res.redirect(githubURL)
    }catch(error){
        console.log("GithubUrlError:",error);
    }
}

export const signinwithGithubUser = async (req:Request,res:Response) => {
    try{
        
        // 1. Now When github will attach code on callback route,exchange the access token from code
        //  and then by token we request a github endpoint to retrieve the user info
        const { code } = req.query;
        console.log(code);
        
        if(!code || typeof code !== "string"){
            return res.status(400).json({
                message:"Github authorization code is missing"
            })
        }

        // 2. Extract the userinfo by signing user with Github
        const user = await socialProvidersService.signinwithGithub(code)
        console.log(user); // Response will look like
        /*
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
        
        // 3. Save user to the Database
        if(user){ await userService.createUser(user)}
        
        res.redirect("http://localhost:5173")

        // 4. 
     
    }catch(error){
       res.status(500).json({Message:error})
    }
}

export const getFacebookURL = async (req:Request,res:Response) => {
   try{

   }catch(error){

   }



};
export const signinwithFacebookUser = async (req:Request,res:Response) => {
   try{
    
   }catch(error){
    
   }
};
export const getGoogleURL = async (req:Request,res:Response) => {
   try{
        const googleURL = await socialProvidersService.getGoogleOauthURL()
        console.log(googleURL);
        if(googleURL) {
            res.redirect(googleURL)
            };
   }catch(error){
        console.error("Google OAuth sign-in failed", error);
        throw new Error("Google authentication failed");
   }
};
export const signinwithGoogleUser = async (req:Request,res:Response) => {
   try{
      // Extract the code from the request
      const {code,state} = req.query;
      console.log(code);
      if(!code ||  typeof code !=="string"){
        return res.json({message:"Invalid or Expired Code"})
      }
     // Extract the userinfo from the service
      if(!state){ return res.json({
        "Message":"No state found"
      })}
      const user = await socialProvidersService.signinwithGoogle(code,state)
      
      console.log(user);

      // Save the user to Database

      if(user) await userService.createUser(user)
      // Redirect User to the FrontEnd Page
      res.redirect("http://localhost:5173")

   }catch(error){
    
   }
};


const oauthController = {
    getGithubURL,
    signinwithGithubUser,
    getFacebookURL,
    signinwithFacebookUser,
    getGoogleURL,
    signinwithGoogleUser,
    
}

export default oauthController;