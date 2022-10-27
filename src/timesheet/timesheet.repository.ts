import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm'
import { Timesheet } from './timesheet.entity';

@EntityRepository(Timesheet)
export class TimesheetRepository extends Repository<Timesheet> {
    //   getWorkers(): Promise<User[]> {
    //     return 
    //   }
}