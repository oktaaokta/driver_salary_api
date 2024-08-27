export interface GetDriverSalaryParam {
    month: number;   
    year: number;    
    current: number;
    page_size: number;
    driver_code: string;
    status: string;
    name: string;
}

export interface DriverInfo {
  driver_code: string,
  name: string,
  total_attendance_salary: number,
  total_paid: number,
  total_confirmed: number,
  total_pending: number,
  total_salary: number,
  count_shipment: number
}

