import { getDriverSalaryFromDB } from '../repository/repository';
import { getPaidShipmentsFromDB } from '../repository/repository';
import { getConfirmedShipmentsFromDB } from '../repository/repository';
import { getPendingShipmentsFromDB } from '../repository/repository';
import { GetDriverSalaryParam } from '../entities/handler_types';
import { DriverInfo } from '../entities/handler_types';

export async function fetchDriverSalary(params: GetDriverSalaryParam): Promise<DriverInfo[]> {
    try {
        const salaries = await getDriverSalaryFromDB(params.month, params.year);
        const driverInfoArray: DriverInfo[] = [];
        for (const row of salaries.rows) {
            const driverInfo = row as DriverInfo; 
            var totalShipments : number = 0
            const paidInfo  = await getPaidShipmentsFromDB(driverInfo.driver_code, params.month, params.year)
            const totalPaid : number = Number(paidInfo.total_costs)
            totalShipments += Number(paidInfo.total_shipments)

            const pendingInfo  = await getPendingShipmentsFromDB(driverInfo.driver_code, params.month, params.year)
            const totalPending : number = Number(pendingInfo.total_costs)
            totalShipments += Number(paidInfo.total_shipments)

            const confirmedInfo = await getConfirmedShipmentsFromDB(driverInfo.driver_code, params.month, params.year)
            const totalConfirmed : number = Number(confirmedInfo.total_costs)
            totalShipments += Number(confirmedInfo.total_shipments)

            const totalAttendanceSalary : number = Number(driverInfo.total_attendance_salary)
            const totalSalary : number =  totalPaid + totalPending + totalConfirmed + totalAttendanceSalary
            driverInfo.total_paid = totalPaid
            driverInfo.total_pending = totalPending
            driverInfo.total_confirmed = totalConfirmed
            driverInfo.total_salary = totalSalary
            driverInfo.count_shipment = totalShipments
            driverInfoArray.push(driverInfo)
        }

        return driverInfoArray;
    } catch (error) {
        console.error('Error when fetching data: ', error);
        throw error;
    }
}
