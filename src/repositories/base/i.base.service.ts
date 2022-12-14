import { EntityId } from 'typeorm/repository/EntityId'
import { DeleteResult, Entity } from 'typeorm';

export interface IBaseService<T> {

    createOneObj(data: any): Promise<T>

    findOneObj(id: EntityId): Promise<T>

    getAllObj(paging: any): Promise<[T[], number]>

    GetOneObj(id: EntityId): Promise<T>

    UpdateOneObj(id: EntityId, data: any): Promise<T>

    deleteOneObj(id: EntityId): Promise<DeleteResult>
}