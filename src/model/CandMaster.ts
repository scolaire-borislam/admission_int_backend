export interface  CandMaster  {
    id: number; //row id in datagrid
    uid: string;
    sk: string;
    walletAddress: string; 
    lastUpdatedTime: string; 
}

export function  candMastertoJson(obj : CandMaster): CandMasterDbJson {
    if(!obj) {
      throw new Error('CandMaster is undefined');
    }
    return {
      // Map to different property names
      pk: obj.uid, 
      sk: obj.sk,
      wallet_address: obj.walletAddress,
      last_update_time: obj.lastUpdatedTime,
    };
};   


export type CandMasterDbJson = {
  pk : string;
  sk: string;
  wallet_address: string;
  last_update_time: string;
}

