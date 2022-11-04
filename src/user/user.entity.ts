
import { Column, Entity, OneToOne, Index, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Task } from '../task/task.entity';
import { Project } from '../project/project.entity';
import { Timesheet } from "../timesheet/timesheet.entity";

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column({ default: 3 })
    level: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @OneToMany(() => Timesheet, ts => ts.creator, { onUpdate: 'CASCADE' })
    timesheets: Timesheet[];

    @ManyToMany(() => Project, (project) => project.workers, { onUpdate: 'CASCADE' })
    projects: Project[];

    constructor(partial: Partial<User>) {
        super()
        Object.assign(this, partial)
    }
}
