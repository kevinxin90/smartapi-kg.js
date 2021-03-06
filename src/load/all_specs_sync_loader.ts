import BaseLoader from './base_loader';
import { SmartAPIQueryResult } from '../types';
import { SmartAPISpec } from '../parser/types';
import fs from 'fs';
import path from 'path';

export default class AllSpecsSyncLoader extends BaseLoader {
    private _file_path: string;
    constructor(path: string) {
        super();
        this._file_path = path;
    }
    protected fetch(): SmartAPIQueryResult {
        const file = fs.readFileSync(this._file_path, 'utf-8');
        const data = JSON.parse(file) as SmartAPIQueryResult;
        return data;
    }

    protected parse(input: SmartAPIQueryResult): SmartAPISpec[] {
        return input.hits;
    }

    load(): SmartAPISpec[] {
        const specs = this.fetch();
        return this.parse(specs);
    }
}