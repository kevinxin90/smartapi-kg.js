import { SmartAPISpec } from "./parser/types";

export interface SmartAPIQueryResult {
  hits: SmartAPISpec[];
}

export interface BuilderOptions {
  tag?: string;
  teamName?: string;
  smartAPIID?: string;
  component?: string;
}

interface ReasonerSubjectAndPredicate {
  [propName: string]: string[];
}

export interface ReasonerPredicatesResponse {
  [propName: string]: ReasonerSubjectAndPredicate;
}

export interface FilterCriteria {
  input_type?: undefined | string | string[];
  output_type?: undefined | string | string[];
  predicate?: undefined | string | string[];
  api_name?: undefined | string | string[];
  source?: undefined | string | string[];
  [propName: string]: undefined | string | string[];
}

export interface ObjectWithValueAsSet {
  [propName: string]: Set<any>;
}
