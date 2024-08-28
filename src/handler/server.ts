import express, { Request, Response } from 'express';
import { fetchDriverSalary } from '../usecase/usecase';
import { GetDriverSalaryParam } from '../entities/handler_types';
import { ParsedQs } from 'qs';
import { parseArgs } from 'util';

const app = express();
const port = 8000;

app.get('/v1/salary/driver/list', async (req: Request<{}, {}, {}, GetDriverSalaryParam>, res: Response) => {
  try {
    const params = req.query as GetDriverSalaryParam;
    const month = req.query.month as number ;
    if (!month) {
      res.status(400).send('Missing month in parameter');
      return
    }

    const year = req.query.year as number ;
    if (!year) {
      res.status(400).send('Missing year in parameter');
      return
    }

    const response = await fetchDriverSalary(params);
    const responseJson: { [key: string]: any } = {
      data:[]
    };

    var totalRow = 0
    response.forEach(driver => {
        responseJson.data.push(driver)
        totalRow+=1
    });
    responseJson.total_row = totalRow
  
    res.send(responseJson);
  } catch (error) {
    res.status(500).send('Error fetching driver salary: ');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});