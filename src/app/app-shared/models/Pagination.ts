export class Pagination {
    offSet: number;
    limit: number;

    constructor(offSet: number, limit: number) {
        this.offSet = offSet;
        this.limit = limit;
    }
}
