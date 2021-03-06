import SingleSpecSyncLoader from './single_spec_sync_loader';
import TeamSpecsSyncLoader from './team_specs_sync_loader';
import AllSpecsSyncLoader from './all_specs_sync_loader';
import TagSpecsSyncLoader from './tag_specs_sync_loader';
import ComponentSpecsSyncLoader from './component_specs_sync_loader';
import { SmartAPISpec } from '../parser/types';


export const syncLoaderFactory = (smartAPIID: string = undefined, teamName: string = undefined, tag: string = undefined, component: string = undefined, path: string): SmartAPISpec[] => {
    let loader;
    if (!(typeof smartAPIID === "undefined")) {
        loader = new SingleSpecSyncLoader(smartAPIID, path);
    } else if (!(typeof teamName === "undefined")) {
        loader = new TeamSpecsSyncLoader(teamName, path);
    } else if (!(typeof tag === "undefined")) {
        loader = new TagSpecsSyncLoader(tag, path);
    } else if (!(typeof component === "undefined")) {
        loader = new ComponentSpecsSyncLoader(component, path)
    } else {
        loader = new AllSpecsSyncLoader(path);
    }
    return loader.load();
}