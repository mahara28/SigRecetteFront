import { SortFilter } from "./SortFilter";
import { TimeInterval } from "./TimeInterval";

export class SearchRequest {
  qid!: string;
  filters: any[] = [];
  logical_operator?: "AND" | "OR" = "AND";
  time_interval!: TimeInterval;
  page?: number;
  size?: number;
  sort?: SortFilter;
}
