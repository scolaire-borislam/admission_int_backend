import  { create } from "zustand";
import {jwtDecode} from 'jwt-decode';
import {User} from "./../model/User";
import {decodeIdToken} from "./../util/CommonUtil";
import {LOGIN_URL} from "./../util/Constant";



type UserStore = {
  curUser : User | null ,
  idToken: string,
  accessToken : string
  refreshToken: string,
  error: any,
  login: (username :string, password: string)  => void,
  isSessionExpred: ()  => boolean ,
}

export const useUserStore = create<UserStore>()((set, get) => ({
    curUser : null,
    idToken: "",
    accessToken : "",
    refreshToken: "",
    error: null,
    login : async (username: string ,password  : string) => {

        try {
          console.log("login method ...")
          let url = LOGIN_URL;
          let jsonstr =JSON.stringify({"username":  username , "password":  password})  
          const res = await fetch(url,
            {    
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: jsonstr,
            });
            const data = await res.json();
            console.log(data);
            
            if (!res.ok) {
                console.log(res.status)
                console.log(res.statusText)
                throw new Error(`${res.status} ${res.statusText}`);
            } 
            let user : User = decodeIdToken(data.AuthenticationResult.IdToken);
            console.log(user);
            set({ curUser: user , 
              idToken : data.AuthenticationResult.IdToken ,
              accessToken :  data.AuthenticationResult.AccessToken,
              refreshToken :  data.AuthenticationResult.RefreshToken });
            console.log('end of setting state');
        } catch (err ) {
          console.error("Error in data fetch:", err);
          set({ curUser: null , error : err  });
        }
      },
      isSessionExpred : () => {
        const userStore = get();
        if (userStore.idToken) {
          const decoded = jwtDecode(userStore.idToken) ;
          if (decoded.exp) {
            if(decoded.exp > Date.now()/1000) {
              // token expired
              return false;
            } 
          }
        }
        return true;
      },

  }))
