const FILTER_FIELDS = require("./config").FILTER_FIELDS;
const _ = require("lodash");

/**
 * filter an array of objects based on the filter criteria
 * @param {Array} associations - an array of objects, each represents an association
 * @param {Object} criteria - the filter criteria
 */
module.exports = (associations, criteria) => {
    let all_values = {}, filters = {};

    FILTER_FIELDS.map(field => all_values[field] = new Set())
    associations.map(item => {
        FILTER_FIELDS.map(field => {
            all_values[field].add(item.association[field])
        });
    });

    FILTER_FIELDS.map(field => {
        if (!(field in criteria) || criteria[field] === undefined) {
            filters[field] = all_values[field]
        } else {
            if (!Array.isArray(criteria[field])) {
                criteria[field] = [criteria[field]];
            };
            filters[field] = new Set(criteria[field]);
        }
    });

    let res = _.cloneDeep(associations);
    FILTER_FIELDS.map(field => {
        res = res.filter(rec => filters[field].has(rec.association[field]))
    })
    return res;
}