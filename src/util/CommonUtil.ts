import {jwtDecode} from 'jwt-decode';
import {User} from "./../model/User";

export  async function getDocFileUrl (documentKey: string, actionType: string)
 {
    console.log("start get Document File URL");   
    try {
      let url = "https://524cx7n9db.execute-api.ap-southeast-1.amazonaws.com/Prod/GetDocUrl";
      let jsonstr =JSON.stringify({"documentKey":  documentKey , "actionType" : actionType}) 
      const res = await fetch(url,
      {    
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
              },
            body: jsonstr,
      });
      if (!res.ok) {
        console.log(res.status)
        console.log(res.statusText)
        throw new Error(`${res.status} ${res.statusText}`);
      } 
      console.log("end get Document File URL");  
      return res.text();
    } catch (err ) {
      console.error("Error in data fetch:", err);

    }
}


export function decodeIdToken(idToken: string): User {
    //const decoded = jwtDecode(idToken);
    const decoded = jwtDecode<{
      name: string;
      given_name: string;
      phone_number: string;
      email: string;
      sub: string;
    }>(idToken);
  
  
    return {
      uid : decoded.sub,
      givenName: decoded.given_name, 
      surname: decoded.name, 
      email: decoded.email,
      mobile: decoded.phone_number,
    }
  }