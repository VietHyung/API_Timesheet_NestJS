import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { Client } from '../client/client.entity';
import { Project } from '../project/project.entity';
import { Task } from '../task/task.entity';
import { Timesheet } from '../timesheet/timesheet.entity';


export enum Action {
    Manage = 'manage',//full option :)
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

export type Subjects = InferSubjects<
    | typeof User
    | typeof Client
    | typeof Project
    | typeof Task
    | typeof Timesheet
    | 'all'
>

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
    userAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        if (user.level == 1) {
            can(Action.Manage, 'all'); // read-write access to everything
        } else {
            if (user.level == 2) {
                can(Action.Read, Timesheet);
                can(Action.Update, Timesheet);
                cannot(Action.Manage, Project).because('you are not allowed to manage project');
                cannot(Action.Manage, Task).because('you are not allowed to manage task');
                cannot(Action.Manage, Client).because('you are not allowed to manage client');
                cannot(Action.Manage, User).because('you are not allowed to manage user');
                cannot(Action.Manage, Timesheet).because('you are not allowed to manage timesheet');
                cannot(Action.Create, Timesheet).because('you are not allowed to create timesheet');
            } else {
                can(Action.Manage, Timesheet);
                cannot(Action.Manage, Project).because('you are not allowed to manage project');
                cannot(Action.Manage, Task).because('you are not allowed to manage task');
                cannot(Action.Manage, Client).because('you are not allowed to manage client');
                cannot(Action.Manage, User).because('you are not allowed to manage user');
            }
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
