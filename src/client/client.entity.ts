
import { Column, Entity, ObjectIdColumn, Index, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, BaseEntity } from "typeorm";
import { Project } from '../project/project.entity';


@Entity('clients')
export class Client extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    clientName: string;

    @Column()
    address: string;

    @Column()
    phone: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @ManyToMany(() => Project, proj => proj.clients, { onUpdate: 'CASCADE' })
    @JoinTable()
    projects: Project[];

    constructor(client?: Partial<Client>) {
        super();
        Object.assign(this, client);
    }
}
