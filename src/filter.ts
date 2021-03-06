import { FILTER_FIELDS } from './config';
import _ from 'lodash';
import { FilterCriteria, ObjectWithValueAsSet } from './types';
import { SmartAPIKGOperationObject } from './parser/types';


const getUniqueValsForEachField = (operations: SmartAPIKGOperationObject[]): ObjectWithValueAsSet => {
    const allValues = {} as ObjectWithValueAsSet;
    FILTER_FIELDS.map(field => allValues[field] = new Set())
    operations.map(operation => {
        FILTER_FIELDS.map(field => {
            allValues[field].add(operation.association[field])
        });
    });
    return allValues;
}

/**
 * filter an array of objects based on the filter criteria
 * @param {Array} ops - an array of objects, each represents an association
 * @param {Object} criteria - the filter criteria
 */
export const ft = (ops: SmartAPIKGOperationObject[], criteria: FilterCriteria) => {
    const allValues = getUniqueValsForEachField(ops);
    const filters = {} as ObjectWithValueAsSet;

    FILTER_FIELDS.map(field => {
        if (!(field in criteria) || criteria[field] === undefined) {
            filters[field] = allValues[field]
        } else {
            const vals = (Array.isArray(criteria[field])) ? criteria[field] : [criteria[field]];
            filters[field] = new Set(vals);
        }
    });

    let res = _.cloneDeep(ops);
    FILTER_FIELDS.map(field => {
        res = res.filter(rec => filters[field].has(rec.association[field]))
    })
    return res;
}
