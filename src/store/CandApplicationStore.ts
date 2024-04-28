import  { create } from "zustand";
import {jwtDecode} from 'jwt-decode';
import {User} from "./../model/User";
import {CandApplication, candApptoJson} from "./../model/CandApplication";
import {CandMaster, candMastertoJson } from "./../model/CandMaster";
import {GET_CAND_MASTER_URL, SEARCH_APPLICATION_URL, UPDATE_APPLICATION_URL, SEND_CONTRACT_STATUS_UPD_URL, ISSIUE_CARD_URL} from "./../util/Constant";

type CandAppStoreState = {
    curApp : CandApplication | null ,
    curCandMaster : CandMaster | null,
    listCandApp : CandApplication[];
    error: any,
    setApp: (newValue : CandApplication) => void,
    retreiveApp: (email :string, appNo :string) => void,
    retreiveCandMaster: (uid :string) => void,
    searchApp: (email :string, appNo :string, progCode :string)  => void,
    updateApp: (updateCandInfo : any)  => void,
    issueCard: (cardInfo : any)  => void,
  }

export const useCandAppStore = create<CandAppStoreState>()((set) => ({
    curApp : null,
    curCandMaster : null,
    listCandApp: [],
    error: null,    
    setApp: (newValue : CandApplication) => set({ curApp: newValue }),

    retreiveApp : async  (email :string, appNo :string) => {
        console.log("get a single cand App"  ) ;   
        console.log(email) ; 
        console.log(appNo) ; 
        try {          
          let url = SEARCH_APPLICATION_URL + '?email=' + email + '&app_no=' + appNo;
          const res = await fetch(url,
            {    
                method: 'GET',
            });
          console.log(res.body);  
          const data = await res.json();
          if (data) {
            let candAppJson = data[0]; 
            const resultCandApp : CandApplication = {
              uid: candAppJson["pk"],
              appNo: candAppJson["sk"],
              address: candAppJson["address"],
              createDate: candAppJson["create_date"],
              dateOfBirth: new Date(candAppJson["dob"]),
              educationQualification1: candAppJson["education_qualification1"],
              educationQualification2: candAppJson["education_qualification2"],
              educationQualification3: candAppJson["education_qualification3"],
              email: candAppJson["email"],
              entryYear: candAppJson["entry_year"],
              gender: candAppJson["gender"],
              givenName: candAppJson["given_name"],
              idDocNo: candAppJson["id_doc_no"],
              intakeTerms: candAppJson["intake_terms"],
              lastUpdatedTime: new Date(candAppJson["last_update_time"]),
              mobile: candAppJson["mobile"],
              modeOfStudy: candAppJson["mode_of_study"],
              photoPath: candAppJson["photo_path"],
              professionalQualification1: candAppJson["professional_qualification1"],
              professionalQualification2: candAppJson["professional_qualification2"],
              professionalQualification3: candAppJson["professional_qualification3"],
              programCode: candAppJson["prog_code"],
              programName: candAppJson["prog_name"],
              programProvider: candAppJson["prog_provider"],
              sen: candAppJson["SEN"],
              senDetail: candAppJson["sen_detail"],
              status: candAppJson["status"],
              surname: candAppJson["surname"],
              id: 0,
              idDocPath: "",
              studentNo: "",
              hkitScardPath : candAppJson["hkit_scard_path"],
              uwlScardPath : candAppJson["uwl_scard_path"]
              
            };
            console.log(resultCandApp);
            set({ curApp: resultCandApp , 
              error :  null, });
          }
  
        } catch (err ) {
          console.error("Error in data fetch:", err);
          set({  error : err  });
        }
        
    },
    searchApp : async (email :string, appNo :string, progCode :string)  => {
        console.log("search Cand App by criteria");   
        set({ curApp: null , 
            listCandApp: [],
            error :  null, });
        try {
          
          let url = SEARCH_APPLICATION_URL + '?';
          if (email !="" ) {
            url += 'email=' + email +'&'
          }
          if (appNo !="" ) {
            url += 'app_no=' + appNo +'&'
          }
          if ((progCode !="") && 
                  (progCode != "-"  )) {
            url += 'prog_code=' + progCode  +'&'
          }
          const res = await fetch(url,
          {    
              method: 'GET',
          });
          console.log(url);
          const data = await res.json();
          console.log(data);
            
          if (!res.ok) {
              console.log(res.status)
              console.log(res.statusText)
              throw new Error(`${res.status} ${res.statusText}`);
          } 

          const candAppList: CandApplication[] = data.map((obj: any,index : number ) => {
            return {
              id: index + 1,
              uid:  obj["pk"],
              appNo: obj["sk"],
              address: obj["address"],
              createDate: obj["create_date"],
              dateOfBirth: new Date(obj["dob"]),
              educationQualification1: obj["education_qualification1"],
              educationQualification2: obj["education_qualification2"],
              educationQualification3: obj["education_qualification3"], 
              email: obj["email"],
              entryYear: obj["entry_year"],
              gender: obj["gender"],
              givenName: obj["given_name"],
              idDocNo: obj["id_doc_no"],
              //idDocPath: obj["pk"],
              intakeTerms: obj["intake_terms"],
              lastUpdatedTime: new Date(obj["last_update_time"]),
              mobile: obj["mobile"],
              modeOfStudy: obj["mode_of_study"],
              photoPath: obj["photo_path"],
              professionalQualification1: obj["professional_qualification1"],
              professionalQualification2: obj["professional_qualification2"],
              professionalQualification3: obj["professional_qualification3"],
              programCode: obj["prog_code"],
              programName: obj["prog_name"],
              programProvider: obj["prog_provider"],
              sen: obj["SEN"],
              senDetail: obj["sen_detail"],
              status: obj["status"],
              //studentNo: obj["pk"],
              surname: obj["surname"],
              hkitScardPath: obj["hkit_scard_path"],
              uwlScardPath: obj["uwl_scard_path"],
              // Map other properties if needed
            };
          });

          console.log(candAppList);
          set({ listCandApp: candAppList ,} );
            console.log('end of setting state');
        } catch (err ) {
          console.error("Error in data fetch:", err);
          set({ listCandApp: [] , error : err  });
        }

    },
    updateApp: async (updateCandAppJson : any)  =>  {
      
      try {
        console.log("update Cand App status");   
        let url = UPDATE_APPLICATION_URL;        
        let jsonstr =JSON.stringify({"item":  updateCandAppJson}) 
        const res = await fetch(url,
        {    
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',          
              },
            body: jsonstr,

        });
        console.log(url);
        const data = await res.json();
        console.log(data);
            
        if (!res.ok) {
            console.log(res.status)
            console.log(res.statusText)
            throw new Error(`${res.status} ${res.statusText}`);
        } 

        console.log("send smart contract status update"); 
        let sendUpdateurl = SEND_CONTRACT_STATUS_UPD_URL;        
        let paramJsonstr =JSON.stringify({"app_id":  updateCandAppJson.sk , "status":  updateCandAppJson.status }) 
        const sendUpdRes = await fetch(sendUpdateurl,
        {    
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',          
              },
            body: paramJsonstr,

        });
        if (!sendUpdRes.ok) {
          console.log(sendUpdRes.status)
          console.log(sendUpdRes.statusText)
          throw new Error(`${sendUpdRes.status} ${sendUpdRes.statusText}`);
        } 
      } catch (err ) {
        console.error("Error in update fetch:", err);
        set({ listCandApp: [] , error : err  });
        throw err;
      }  
    },

    issueCard: async (candMasterParam : any)  =>  {
      
      try {
        console.log("issue Cand parm : ",candMasterParam);   
        let url = ISSIUE_CARD_URL;        
        let jsonstrparam =JSON.stringify(candMasterParam) 
        console.log('jsonstr',jsonstrparam)
        console.log(url);
        const res = await fetch(url,
        {    
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',          
              },
            body: jsonstrparam,

        });
        const data = await res.json();
        console.log(data);
            
        if (!res.ok) {
            console.log(res.status)
            console.log(res.statusText)
            throw new Error(`${res.status} ${res.statusText}`);
        } 

      } catch (err ) {
        console.error("Error in update fetch:", err);
        set({ listCandApp: [] , error : err  });
        throw err;
      }  
    },

    retreiveCandMaster : async  (uid :string) => {
      console.log("get a single cand Master"  ) ;   
      console.log(uid) 
      try {          
        let url = GET_CAND_MASTER_URL + '?pk=' + uid ;
        const res = await fetch(url,
          {    
              method: 'GET',
          });
        console.log(res.body);  
        const data = await res.json();
        console.log(data)
        console.log("finish get master cand")
        if (data) {
          let candMasterJson = data; 
          const resultCandMaster : CandMaster = {
            id : 0,
            uid: uid,
            sk: candMasterJson.sk,
            walletAddress: candMasterJson.wallet_address,
            lastUpdatedTime: candMasterJson.last_update_time,
           
          };
          console.log(resultCandMaster);
          set({ curCandMaster: resultCandMaster , 
            error :  null, });
        }

      } catch (err ) {
        console.error("Error in data fetch for Master Cand:", err);
        set({  error : err  });
      }
      
  },

  }))