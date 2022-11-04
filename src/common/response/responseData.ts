import { Paging } from "./paging";

export class ResponseData {
    readonly status: number;
    readonly message: string;
    readonly data: any;
    readonly metaData?: Paging;
    readonly code?: number;

    constructor(status: number, data: any, message?: string, paging?: Paging, code?: number) {
        this.status = status;
        this.message = message || 'Success';
        this.data = data;
        this.metaData = paging;
        this.code = code;
    }
}