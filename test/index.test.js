const kg = require('../index');

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