import { FILTER_FIELDS } from './config';
import _ = require("lodash");
import { SmartAPIOperation, FilterCriteria, ObjectWithValueAsSet } from './utils/types'

/**
 * filter an array of objects based on the filter criteria
 * @param {Array} ops - an array of objects, each represents an association
 * @param {Object} criteria - the filter criteria
 */
const filter = (ops: SmartAPIOperation[], criteria: FilterCriteria) => {
    const allValues = {} as ObjectWithValueAsSet;
    const filters = {} as ObjectWithValueAsSet;

    FILTER_FIELDS.map(field => allValues[field] = new Set())
    ops.map(item => {
        FILTER_FIELDS.map(field => {
            allValues[field].add(item.association[field])
        });
    });

    FILTER_FIELDS.map(field => {
        if (!(field in criteria) || criteria[field] === undefined) {
            filters[field] = allValues[field]
        } else {
            if (!Array.isArray(criteria[field])) {
                criteria[field] = [criteria[field]];
            };
            filters[field] = new Set(criteria[field]);
        }
    });

    let res = _.cloneDeep(ops);
    FILTER_FIELDS.map(field => {
        res = res.filter(rec => filters[field].has(rec.association[field]))
    })
    return res;
}

export = filter;