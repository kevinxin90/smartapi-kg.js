const sift = require("sift")

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
    let filters = this.constructFilter(criteria);
    return associations.filter(sift(filters));
}