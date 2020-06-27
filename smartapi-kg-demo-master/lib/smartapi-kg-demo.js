const kg = require("@biothings-explorer/smartapi-kg");

let meta_kg = new kg();


await meta_kg.constructMetaKG(source='remote');

meta_kg.ops[0];

meta_kg.filter({predicate: 'treats'});

meta_kg.filter({predicate: 'treats', input_id: 'CHEMBL.COMPOUND'});

meta_kg.filter({predicate: ['treats', 'physically_interacts_with'], input_id: 'CHEMBL.COMPOUND'});
