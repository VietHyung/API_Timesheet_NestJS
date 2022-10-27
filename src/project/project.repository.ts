import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm'
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
    //   getWorkers(): Promise<User[]> {
    //     return 
    //   }
}