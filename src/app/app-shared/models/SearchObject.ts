import {Pagination} from './Pagination';
import {Sort} from './Sort';
import {CriteriaSearch} from './CriteriaSearch';

export class SearchObject {
	pagination?: Pagination;
	sort?: Sort;
	listSort?: Array<Sort> = [];
	dataSearch?: Array<CriteriaSearch> = [];
	listCol?: string[]= [];
	particularSpecifCondi? :string;

	//For export
	language?: string;
	typeExport?: 'PDF' | 'EXCEL';
	metadata?: object;

	constructor() {
	}

	static nmSearchObject() {
		const searchObject = new SearchObject()
		searchObject.sort = new Sort('ordre', 'asc nulls last')
		searchObject.listCol = ['id', 'code', 'libelleAr', 'libelleFr', 'libelleEn'];
		return searchObject;
	}
}

