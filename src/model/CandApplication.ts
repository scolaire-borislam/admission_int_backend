export interface  CandApplication  {
    id: number; //row id in datagrid
    uid: string;
    appNo: string;
    address: string;  
    createDate: Date;
    dateOfBirth: Date;
    educationQualification1: string;
    educationQualification2: string;
    educationQualification3: string;  
    email: string;
    entryYear: number;
    gender: string;
    givenName: string;
    idDocNo: string;
    idDocPath: string;
    intakeTerms: string;
    lastUpdatedTime: Date; 
    mobile: string;
    modeOfStudy: string;
    photoPath: string;
    professionalQualification1: string;
    professionalQualification2: string;
    professionalQualification3: string;
    programCode: string;
    programName: string; 
    programProvider: string;
    sen: string;
    senDetail: string;
    status: string;
    studentNo: string;
    surname: string;
    hkitScardPath: string;
    uwlScardPath: string;
  
}

export function  candApptoJson(obj : CandApplication): CandAppDbJson {
    if(!obj) {
      throw new Error('CandApplication is undefined');
    }
    return {
      // Map to different property names
      pk: obj.uid, 
      sk: obj.appNo,
      email: obj.email,
      address: obj.address,
      status: obj.status,
      student_no: obj.studentNo,
      surname: obj.surname,
      given_name: obj.givenName,
      id_doc_no: obj.idDocNo,
    };
};   


export type CandAppDbJson = {
  pk : string;
  sk: string;
  email: string;
  address: string;
  status: string;
  student_no: string;
  surname: string;
  given_name: string;
  id_doc_no: string;
}

