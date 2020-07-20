//let sf = require("sift")

// exports.constructFilter = (criteria) => {
//     const range = ['input_id', 'input_type', 'output_id',
//         'output_type', 'predicate', 'source',
//         'api_name']
//     let exp;
//     criteria = Object.keys(criteria).reduce((obj, key) => {
//         if (range.includes(key)) {
//             if (!Array.isArray(criteria[key])) {
//                 exp = String(criteria[key])
//             } else {
//                 exp = '['
//                 for (let item of criteria[key]) {
//                     exp = exp + "'" + item + "',"
//                 }
//                 exp = exp.substring(0, exp.length - 1);
//                 exp = exp + ']';
//             }
//             exp = exp + '.includes(rec.association.' + key + ')';
//             if (obj === '') {
//                 return exp;
//             }
//             return [obj, exp].join("&&")
//         }
//         return obj;
//     }, '');
//     return criteria
// }

/**
 * construct the filter for the sift npm package to filter against
 * @param {Object} criteria - filtering criteria, each key represents the field to be quried
 */
exports.constructFilter = (criteria) => {
    let res = Object.keys(criteria).map(item => {
        if (!Array.isArray(criteria[item])) {
            criteria[item] = [criteria[item]]
        };
        return {
            ["association." + item]: {
                $in: criteria[item]
            }
        }
    });
    return { "$and": res }
}

/**
 * filter an array of objects based on the filter criteria
 * @param {Array} associations - an array of objects, each represents an association
 * @param {Object} criteria - the filter criteria
 */
exports.filterAssociations = (associations, criteria) => {
    let all_input_types = new Set(), all_output_types = new Set(), all_predicates = new Set(), all_apis = new Set();
    let input_types, output_types, predicates, apis;
    associations.map(item => {
        all_input_types.add(item.association.input_type);
        all_output_types.add(item.association.output_type);
        all_predicates.add(item.association.predicate);
        all_apis.add(item.association.api_name);
    });
    if (!("input_type" in criteria) || criteria.input_type === undefined) {
        input_types = all_input_types;
    } else {
        if (!Array.isArray(criteria.input_type)) {
            criteria.input_type = [criteria.input_type]
        }
        input_types = new Set(criteria.input_type)
    }
    if (!("output_type" in criteria) || criteria.output_type === undefined) {
        output_types = all_output_types;
    } else {
        if (!Array.isArray(criteria.output_type)) {
            criteria.output_type = [criteria.output_type]
        }
        output_types = new Set(criteria.output_type)
    }
    if (!("predicate" in criteria) || criteria.predicate === undefined) {
        predicates = all_predicates;
    } else {
        if (!Array.isArray(criteria.predicate)) {
            criteria.predicate = [criteria.predicate]
        }
        predicates = new Set(criteria.predicate)
    };
    if (!("api" in criteria) || criteria.api === undefined) {
        apis = all_apis;
    } else {
        if (!Array.isArray(criteria.api)) {
            criteria.api = [criteria.api]
        }
        apis = new Set(criteria.api)
    };
    //let filters = this.constructFilter(criteria);
    //return associations.filter(sf(filters));
    return associations.filter(rec => input_types.has(rec.association.input_type) && output_types.has(rec.association.output_type) && predicates.has(rec.association.predicate) && apis.has(rec.association.api_name))
}