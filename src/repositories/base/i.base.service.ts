import { EntityId } from 'typeorm/repository/EntityId'
import { DeleteResult, Entity } from 'typeorm';

export interface IBaseService<T> {

    createOneObj(data: any): Promise<T>

    findOneObj(id: EntityId): Promise<T>

    getAllObj(): Promise<T[]>

    GetOneObj(id: EntityId): Promise<T>

    UpdateOneObj(id: EntityId, data: any): Promise<T>

    isUser(id: EntityId): Promise<Boolean>

    isPM(id: EntityId): Promise<Boolean>

    isAdmin(id: EntityId): Promise<Boolean>

    deleteOneObj(id: EntityId): Promise<DeleteResult>
}