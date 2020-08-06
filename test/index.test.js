const kg = require('../src/index');

describe('test Meta-KG using local specs', () => {

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

describe('test Meta-KG using local specs of BioThings collection only', () => {

    let meta_kg;

    beforeAll(() => {
        meta_kg = new kg();
        meta_kg.constructMetaKGSync(category = "biothings");
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
        expect(apis).not.toContain("DGIIdb API");
        expect(apis).toContain("MyChem.info API");
    });


});

describe('test Meta-KG through query SmartAPI API', () => {

    let meta_kg;

    beforeAll(async () => {
        meta_kg = new kg();
        await meta_kg.constructMetaKG(source = "remote");
    });

    test("test filter", () => {
        let res = meta_kg.filter({ predicate: 'treats' });
        expect(res[0]['association']['predicate']).toBe('treats');
    });
});