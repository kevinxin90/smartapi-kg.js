"use strict";
const config_1 = require("./config");
const _ = require("lodash");
/**
 * filter an array of objects based on the filter criteria
 * @param {Array} ops - an array of objects, each represents an association
 * @param {Object} criteria - the filter criteria
 */
const filter = (ops, criteria) => {
    let all_values = {}, filters = {};
    config_1.FILTER_FIELDS.map(field => all_values[field] = new Set());
    ops.map(item => {
        config_1.FILTER_FIELDS.map(field => {
            all_values[field].add(item.association[field]);
        });
    });
    config_1.FILTER_FIELDS.map(field => {
        if (!(field in criteria) || criteria[field] === undefined) {
            filters[field] = all_values[field];
        }
        else {
            if (!Array.isArray(criteria[field])) {
                criteria[field] = [criteria[field]];
            }
            ;
            filters[field] = new Set(criteria[field]);
        }
    });
    let res = _.cloneDeep(ops);
    config_1.FILTER_FIELDS.map(field => {
        res = res.filter(rec => filters[field].has(rec.association[field]));
    });
    return res;
};
module.exports = filter;
