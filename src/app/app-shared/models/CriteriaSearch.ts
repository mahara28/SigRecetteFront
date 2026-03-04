export class CriteriaSearch {
    
    key: string;
    value: number | string | boolean | number[];
    specificSearch: string;

    constructor(key: string, value: number | string | boolean | number[], specificSearch: string){
        this.key = key;
        this.value = value;
        this.specificSearch = specificSearch;
    }
}
