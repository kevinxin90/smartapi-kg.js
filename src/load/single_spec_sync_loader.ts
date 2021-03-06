import AllSpecsSyncLoader from './all_specs_sync_loader';
import { SmartAPIQueryResult } from '../types';
import { SmartAPISpec } from '../parser/types';

export default class SingleSpecSyncLoader extends AllSpecsSyncLoader {
    private _smartAPIID: string;

    constructor(smartAPIID: string, path: string) {
        super(path);
        this._smartAPIID = smartAPIID;
    }

    parse(input: SmartAPIQueryResult): SmartAPISpec[] {
        return input.hits.filter(item => item._id === this._smartAPIID);
    }
}