
import { Project } from "src/project/project.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ObjectIdColumn, Index, ManyToOne, PrimaryGeneratedColumn, JoinColumn, BaseEntity } from "typeorm";
import { Task } from '../task/task.entity';
enum TimesheetStatus {
    New = 'New',
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

enum TimesheetType {
    NWH = 'Normal working hours',
    Overtime = 'Overtime'
}

@Entity('timesheet')
export class Timesheet extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    note: string;

    @Column()
    workingTime: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.timesheets, { onUpdate: 'CASCADE' })
    creator: User;

    @Column()
    creatorId: string;

    @Column({
        type: 'enum',
        default: TimesheetStatus.New,
        enum: TimesheetStatus,
    })
    status: string;

    @Column({
        type: 'enum',
        default: TimesheetType.NWH,
        enum: TimesheetType,
    })
    type: string;

    @ManyToOne(() => Task, task => task.timesheets, { onUpdate: 'CASCADE' })
    task: Task;

    @ManyToOne(() => Project, proj => proj.timesheets, { onUpdate: 'CASCADE' })
    project: Project;

    @Column()
    projectId: string;

    constructor(task?: Partial<Timesheet>) {
        super()
        Object.assign(this, task)
    }
}
