
import { Client } from "../client/client.entity";
import { Task } from "../task/task.entity";
import { User } from "../user/user.entity";
import { Column, Entity, ObjectIdColumn, Index, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, BaseEntity, JoinTable } from "typeorm";
import { Timesheet } from '../timesheet/timesheet.entity';


@Entity('projects')
export class Project extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    projName: string;

    @Column({ nullable: false, type: 'nvarchar' })
    instructorId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @Column()
    type: number;

    @Column()
    note: string;

    @OneToMany(() => Task, task => task.project, { onUpdate: 'CASCADE' })
    tasks: Task[];

    @OneToMany(() => Timesheet, ts => ts.project, { onUpdate: 'CASCADE' })
    timesheets: Timesheet[];

    @ManyToMany(() => User, user => user.projects, { onUpdate: 'CASCADE' })
    @JoinTable()
    workers: User[];

    @ManyToMany(() => Client, client => client.projects, { onUpdate: 'CASCADE' })
    clients: Client[];



    constructor(project?: Partial<Project>) {
        super()
        Object.assign(this, project)
    }
}
