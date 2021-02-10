const dataload = require("../../built/dataload");


describe('Test Load specs from remote', () => {
    test("Test load all specs from SmartAPI registry alive", async () => {
        const res = await dataload.loadSpecsFromRemote();
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBeGreaterThan(0);
    });

    test("Test load one spec from SmartAPI registry alive using SmartAPI ID", async () => {
        const validID = "671b45c0301c8624abbd26ae78449ca2"
        const res = await dataload.loadSpecsFromRemote(validID);
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toEqual(1);
        expect(res[0].info.title).toEqual("mydisease.info API");
    });

    test("Test load one spec from SmartAPI registry alive using invalid SmartAPI ID", async () => {
        const invalidID = "1";
        try {
            await dataload.loadSpecsFromRemote(invalidID);
        } catch (e) {
            expect(e.name).toEqual('InvalidSmartAPIIDError');
        }
    });
})