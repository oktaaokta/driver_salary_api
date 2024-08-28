export interface GetDriverSalaryRepositoryParam {
    month: number;   
    year: number;    
    current: number;
    pageSize: number;
    driverCode: string;
    status: string;
    name: string;
  }