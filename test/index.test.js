const kg = require('../src/index');

describe('test Meta-KG using remote specs', () => {

    let meta_kg;

    beforeAll(async () => {
        meta_kg = new kg();
        await meta_kg.constructMetaKG();
    });

    test("test filter", () => {
        let res = meta_kg.filter({ predicate: 'treats' });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter with value as array", () => {
        let res = meta_kg.filter({ predicate: ['treats'] });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter by api", () => {
        let res = meta_kg.filter({ api_name: "MyChem.info API" });
        expect(res[0]['association']['api_name']).toBe("MyChem.info API");
        res = meta_kg.filter({ api_name: "Automat PHAROS API" });
        expect(res[0]['association']['api_name']).toBe("Automat PHAROS API");
    });

    test("test filter by multiple criteria", () => {
        let res = meta_kg.filter({ api_name: "Automat PHAROS API", input_type: "ChemicalSubstance", output_type: "Gene" });
        expect(res[0]['association']['api_name']).toBe("Automat PHAROS API");
        expect(res.length).toBe(1);
    });
});

// describe('test Meta-KG using local specs', () => {

//     let meta_kg1;

//     beforeAll(async () => {
//         meta_kg1 = new kg();
//         meta_kg1.constructMetaKGSync();
//     });

//     test("test filter", () => {
//         let res = meta_kg1.filter({ predicate: 'treats' });
//         expect(res[0]['association']['predicate']).toBe('treats');
//     });

//     test("test filter with value as array", () => {
//         let res = meta_kg1.filter({ predicate: ['treats'] });
//         expect(res[0]['association']['predicate']).toBe('treats');
//     });

//     test("test filter by api", () => {
//         let res = meta_kg1.filter({ api_name: "MyChem.info API" });
//         expect(res[0]['association']['api_name']).toBe("MyChem.info API");
//         res = meta_kg.filter({ api_name: "Automat PHAROS API" });
//         expect(res[0]['association']['api_name']).toBe("Automat PHAROS API");
//     });

//     test("test filter by multiple criteria", () => {
//         let res = meta_kg1.filter({ api_name: "Automat PHAROS API", input_type: "ChemicalSubstance", output_type: "Gene" });
//         expect(res[0]['association']['api_name']).toBe("Automat PHAROS API");
//         expect(res.length).toBe(1);
//     });
// });

describe('test Meta-KG using local specs of BioThings collection only', () => {

    let meta_kg;

    beforeEach(() => {
        meta_kg = new kg();
        meta_kg.constructMetaKGSync(tag = "biothings");
        let apis = new Set();
        meta_kg.ops.map(item => apis.add(item.association.api_name));
    });

    test("test filter", () => {
        let res = meta_kg.filter({ predicate: 'treats' });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter with value as array", () => {
        let res = meta_kg.filter({ predicate: ['treats'] });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter by api", () => {
        let res = meta_kg.filter({ api_name: "MyChem.info API" });
        expect(res[0]['association']['api_name']).toBe("MyChem.info API");
    });

    test("test filter by multiple criteria", () => {
        let res = meta_kg.filter({ api_name: "Automat PHAROS API", input_type: "ChemicalSubstance", output_type: "Gene" });
        expect(res.length).toBe(0);
    });

    test("test non-biothings APIs should be excluded", () => {
        let apis = meta_kg.ops.map(item => item.association.api_name);
        expect(apis).not.toContain("DGIdb API");
        expect(apis).toContain("MyChem.info API");
    });


});

describe('test Meta-KG through query SmartAPI API', () => {

    let meta_kg;

    beforeAll(async () => {
        meta_kg = new kg();
        await meta_kg.constructMetaKG();
    });

    test("test filter", () => {
        let res = meta_kg.filter({ predicate: 'treats' });
        expect(res[0]['association']['predicate']).toBe('treats');
    });
});

describe('test Meta-KG through query SmartAPI API and include ReasonerAPI', () => {

    let meta_kg;

    beforeAll(async () => {
        meta_kg = new kg();
        await meta_kg.constructMetaKG(includeReasoner = true);
    });

    test("test if the response contains reasoner API", () => {
        let api_names = meta_kg.ops.map(item => item.association.api_name);
        expect(api_names).toContain("Molecular Data Provider API");
    });

    test("test if filter response contains reasoner API", () => {
        let res = meta_kg.filter({ input_type: "ChemicalSubstance", output_type: "ChemicalSubstance", predicate: "correlated_with" })
        let api_names = res.map(item => item.association.api_name);
        expect(api_names).toContain("Molecular Data Provider API");
    });


});

describe('test Meta-KG through query SmartAPI API and only include BioThings collection', () => {

    let meta_kg;

    beforeEach(async () => {
        meta_kg = new kg();
        await meta_kg.constructMetaKG(false, tag = "biothings");
    });

    test("test filter", () => {
        let res = meta_kg.filter({ predicate: 'treats' });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter with value as array", () => {
        let res = meta_kg.filter({ predicate: ['treats'] });
        expect(res[0]['association']['predicate']).toBe('treats');
    });

    test("test filter by api", () => {
        let res = meta_kg.filter({ api_name: "MyChem.info API" });
        expect(res[0]['association']['api_name']).toBe("MyChem.info API");
    });

    test("test filter by multiple criteria", () => {
        let res = meta_kg.filter({ api_name: "Automat PHAROS API", input_type: "ChemicalSubstance", output_type: "Gene" });
        expect(res.length).toBe(0);
    });

    test("test non-biothings APIs should be excluded", () => {
        let apis = meta_kg.ops.map(item => item.association.api_name);
        expect(apis).not.toContain("DGIdb API");
        expect(apis).toContain("MyChem.info API");
    });


});