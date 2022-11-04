
import { Project } from "../project/project.entity";
import { User } from "../user/user.entity";
import { Column, Entity, ObjectIdColumn, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Timesheet } from '../timesheet/timesheet.entity';


@Entity('tasks')
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @ManyToOne(() => User, user => user.tasks, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    user: User;

    @ManyToOne(() => Project, project => project.tasks,
        {
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    )
    project: Project;

    @OneToMany(() => Timesheet, ts => ts.task, { onUpdate: 'CASCADE' })
    timesheets: Timesheet;

    constructor(task: Partial<Task>) {
        super()
        Object.assign(this, task)
    }
}
