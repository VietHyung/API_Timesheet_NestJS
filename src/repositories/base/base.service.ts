import { BaseEntity, DeleteResult, FindOptionsWhere, Repository } from 'typeorm'
import { IBaseService } from './i.base.service'
import { EntityId } from 'typeorm/repository/EntityId'

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T> {
    protected readonly repository: R
    //protected readonly logger: LoggerService

    constructor(repository: R) {//, logger: LoggerService
        this.repository = repository
        //this.logger = logger
    }

    async isPM(id: EntityId): Promise<Boolean> {
        const check = this.findOneObj(id)
        return await check['level'] == 2;
    }
    async isAdmin(id: EntityId): Promise<Boolean> {
        const check = this.findOneObj(id)
        return await check['level'] == 1;
    }
    async isUser(id: EntityId): Promise<Boolean> {
        const check = this.findOneObj(id)
        if (check['level'] == 3) return await true
        else return await false;
    }
    async createOneObj(data: any,): Promise<T> {
        const saved = await this.repository.save(data);
        return saved;
    }
    async findOneObj(id: EntityId): Promise<T> {
        return await this.repository.findOneBy({ id: id } as unknown as FindOptionsWhere<T>);
    }

    async getAllObj(): Promise<T[]> {
        return this.repository.find();
    }

    async GetOneObj(id: EntityId): Promise<T> {
        return await this.findOneObj(id);
    }

    async UpdateOneObj(id: EntityId, data: any): Promise<T> {
        await this.repository.update(id, data);
        return this.findOneObj(id);
    }

    deleteOneObj(id: EntityId): Promise<DeleteResult> {
        return this.repository.delete(id)
    }
}