interface SmartAPIInfo {
    id: string;
    meta: any;
}

interface Association {
    input_id?: string;
    input_type: string;
    output_id?: string;
    output_type: string;
    predicate: string;
    source?: string;
    api_name?: string;
    smartapi?: SmartAPIInfo;
    "x-translator"?: any;
}

export interface SmartAPIOperation {
    association: Association;
    query_operation?: any;
    response_mapping?: any;
    id?: string;
    tags?: string[];
}

export interface MetaKG {
    ops: SmartAPIOperation[];
}

export interface FilterCriteria {
    input_type?: undefined | string | string[];
    output_type?: undefined | string | string[];
    predicate?: undefined | string | string[];
    api_name?: undefined | string | string[];
    source?: undefined | string | string[];
}

interface SmartAPISpecInfo {
    title?: string;
}

export interface SmartAPISpec {
    info?: SmartAPISpecInfo;
    paths?: any;
    [propName: string]: any;
}

export interface SmartAPIQueryResponse {
    data: any;
}

interface ReasonerSubjectAndPredicate {
    [propName: string]: string[];
}

export interface ReasonerPredicatesResponse {
    [propName: string]: ReasonerSubjectAndPredicate;
}

export interface AppConfig {
    FILTER_FIELDS: string[];
    SMARTAPI_URL: string;
}

export interface ObjectWithValueAsSet {
    [propName: string]: any;
}