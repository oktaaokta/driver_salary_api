import { Client } from 'pg';
import { DriverShipment } from '../entities/repository_types';
import { GetDriverSalaryRepositoryParam } from '../entities/usecase_types';

const client = new Client({
    user: 'user',
    host: 'localhost',
    database: 'db-seryu',
    password: 'password',
    port: 5432,
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

export async function getDriverSalaryFromDB(param: GetDriverSalaryRepositoryParam): Promise<any> {
    var query = 'SELECT d.name , da.driver_code , COUNT(da.driver_code) * vc.value AS total_attendance_salary FROM driver_attendances da JOIN drivers d ON da.driver_code = d.driver_code  CROSS JOIN variable_configs vc WHERE da.attendance_status = true and EXTRACT(MONTH FROM attendance_date) = $1 and EXTRACT(year from attendance_date) = $2  GROUP BY d.name,da.driver_code, vc.value  HAVING COUNT(da.driver_code) * vc.value > 0 ORDER BY da.driver_code';
    try {
        if (param.current != undefined) {
            query = query + " offset " + (param.pageSize * (param.current-1))
        } else {
            query = query + " offset 0"
        }

        if (param.pageSize != undefined) {
            query = query + " limit " + param.pageSize
        } else {
            query = query + " limit 10"
        }
        const res = await client.query(query, [param.month, param.year]);
        if (res.rows.length === 0) {
            return null;
        }
        return res;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

export async function getDriverSalaryByDriverCodeFromDB(param: GetDriverSalaryRepositoryParam): Promise<any> {
    const query = 'SELECT d.name , da.driver_code , COUNT(da.driver_code) * vc.value AS total_attendance_salary FROM driver_attendances da JOIN drivers d ON da.driver_code = d.driver_code  CROSS JOIN variable_configs vc WHERE da.attendance_status = true and EXTRACT(MONTH FROM attendance_date) = $1 and EXTRACT(year from attendance_date) = $2 and da.driver_code = $3 GROUP BY d.name,da.driver_code, vc.value HAVING COUNT(da.driver_code) * vc.value > 0 ORDER BY da.driver_code';
    try {
        const res = await client.query(query, [param.month, param.year, param.driverCode]);
        if (res.rows.length === 0) {
            return null;
        }
        return res;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

export async function getDriverSalaryByDriverNameFromDB(param: GetDriverSalaryRepositoryParam): Promise<any> {
    try {
        const query = 'SELECT d.name , da.driver_code , COUNT(da.driver_code) * vc.value AS total_attendance_salary FROM driver_attendances da JOIN drivers d ON da.driver_code = d.driver_code  CROSS JOIN variable_configs vc WHERE da.attendance_status = true and EXTRACT(MONTH FROM attendance_date) = $1 and EXTRACT(year from attendance_date) = $2 and d.name = $3 GROUP BY d.name,da.driver_code, vc.value HAVING COUNT(da.driver_code) * vc.value > 0 ORDER BY da.driver_code';
        const res = await client.query(query, [param.month, param.year, param.name]);
        if (res.rows.length === 0) {
            return null;
        }
        return res;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

export async function getPaidShipmentsFromDB(driverCode: string, month: number, year: number): Promise<DriverShipment> {
    const query = 'select sc.driver_code, sum(total_costs) as total_costs, count(*) as total_shipments from shipment_costs sc join shipments s on s.shipment_no = sc.shipment_no where s.shipment_status not in (\'CANCELLED\', \'RUNNING\') and sc.cost_status = \'PAID\' and sc.driver_code = $1 and EXTRACT(MONTH FROM shipment_date) = $2 and EXTRACT(year from shipment_date) = $3 group by sc.driver_code';
    try {
        const res = await client.query(query, [driverCode, month, year]);
        const DriverShipment = {
            total_costs: 0,
            total_shipments: 0,
        }
        if (res.rows.length === 0) {
            return DriverShipment;
        }
        DriverShipment.total_costs = res.rows[0].total_costs
        DriverShipment.total_shipments = res.rows[0].total_shipments
        
        return DriverShipment;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

export async function getConfirmedShipmentsFromDB(driverCode: string, month: number, year: number): Promise<DriverShipment> {
    const query = 'select sc.driver_code, sum(total_costs) as total_costs, count(*) as total_shipments from shipment_costs sc join shipments s on s.shipment_no = sc.shipment_no where s.shipment_status not in (\'CANCELLED\', \'RUNNING\') and sc.cost_status = \'CONFIRMED\' and sc.driver_code = $1 and EXTRACT(MONTH FROM shipment_date) = $2 and EXTRACT(year from shipment_date) = $3 group by sc.driver_code';
    try {
        const res = await client.query(query, [driverCode, month, year]);
        const DriverShipment = {
            total_costs: 0,
            total_shipments: 0,
        }
        if (res.rows.length === 0) {
            return DriverShipment;
        }
        DriverShipment.total_costs = res.rows[0].total_costs
        DriverShipment.total_shipments = res.rows[0].total_shipments
        
        return DriverShipment;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

export async function getPendingShipmentsFromDB(driverCode: string, month: number, year: number): Promise<DriverShipment> {
    const query = 'select sc.driver_code, sum(total_costs) as total_costs, count(*) as total_shipments from shipment_costs sc join shipments s on s.shipment_no = sc.shipment_no where s.shipment_status not in (\'CANCELLED\', \'RUNNING\') and sc.cost_status = \'PENDING\' and sc.driver_code = $1 and EXTRACT(MONTH FROM shipment_date) = $2 and EXTRACT(year from shipment_date) = $3 group by sc.driver_code';
    try {
        const res = await client.query(query, [driverCode, month, year]);
        const DriverShipment = {
            total_costs: 0,
            total_shipments: 0,
        }
        if (res.rows.length === 0) {
            return DriverShipment;
        }
        DriverShipment.total_costs = res.rows[0].total_costs
        DriverShipment.total_shipments = res.rows[0].total_shipments
        
        return DriverShipment;
    } catch (err) {
        console.error('Error fetching driver salary');
        throw err;
    }
}

process.on('exit', () => {
    client.end();
});
