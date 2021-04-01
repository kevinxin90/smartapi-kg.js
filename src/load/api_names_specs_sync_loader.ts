import AllSpecsSyncLoader from "./all_specs_sync_loader";
import { SmartAPIQueryResult } from "../types";
import { SmartAPISpec } from "../parser/types";

export default class APINamesSpecsSyncLoader extends AllSpecsSyncLoader {
    private _apiNames: string[];

    constructor(apiNames: string[], path: string) {
        super(path);
        this._apiNames = apiNames;
    }

    parse(input: SmartAPIQueryResult): SmartAPISpec[] {
        return input.hits.filter(
            (item) => this._apiNames.includes(item.info.title)
        );
    }
}
