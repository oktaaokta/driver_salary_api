import { getDriverSalaryFromDB, getDriverSalaryByDriverCodeFromDB,getPaidShipmentsFromDB, getConfirmedShipmentsFromDB , getPendingShipmentsFromDB } from '../repository/repository';
import { GetDriverSalaryParam, DriverInfo } from '../entities/handler_types';
import { GetDriverSalaryRepositoryParam } from '../entities/usecase_types';

export async function fetchDriverSalary(params: GetDriverSalaryParam): Promise<DriverInfo[]> {
    try {
        var salaries;
        const getDriverSalaryParam :GetDriverSalaryRepositoryParam = {
            month: params.month,
            year: params.year,
            current: params.current,
            pageSize: params.page_size,
            driverCode: params.driver_code,
            status: params.status,
            name: params.name,
        } 
        if (params.driver_code == undefined) {
            salaries = await getDriverSalaryFromDB(getDriverSalaryParam);
        } else {
            salaries = await getDriverSalaryByDriverCodeFromDB(getDriverSalaryParam);
        }

        const driverInfoArray: DriverInfo[] = [];

        if (!salaries) {
            return driverInfoArray
        }

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
