import env from "src/env"
import { signJwt, verifyJwt } from "./auth.service"


/*
* State: It is used to send custom data during signing with Google
 */

export interface StateInput {
    user_role:String
};

export const generateState = async (state:Object) => {
   if(state) {const encodedState = await signJwt(state,env.ACCESS_SECRET,{expiresIn:"5m"});
    return encodedState}
    return;
};

export const verifyState = async (encodedState:string) => {
    const decodedState = await verifyJwt(encodedState,env.ACCESS_SECRET);
    return {decoded: decodedState.decoded,expired: decodedState.expired}
}

const oauthGoogleService = {
    generateState,
    verifyState
}

export default oauthGoogleService;