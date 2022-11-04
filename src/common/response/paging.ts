export class Paging {
    private readonly page: number
    private readonly pageSize: number
    private readonly totalPage: number
    private readonly total: number

    constructor(page: number, pageSize: number, total: number) {
        this.page = page * 1
        this.pageSize = pageSize * 1
        this.total = total * 1
        this.totalPage = Math.ceil(total % pageSize === 0 ? total / pageSize + 1 : total / pageSize)
    }
}