import SingleSpecSyncLoader from "./single_spec_sync_loader";
import TeamSpecsSyncLoader from "./team_specs_sync_loader";
import AllSpecsSyncLoader from "./all_specs_sync_loader";
import TagSpecsSyncLoader from "./tag_specs_sync_loader";
import ComponentSpecsSyncLoader from "./component_specs_sync_loader";
import APINamesSpecsSyncLoader from "./api_names_specs_sync_loader";
import { SmartAPISpec } from "../parser/types";
import Debug from "debug";
const debug = Debug("smartapi-kg:SyncLoader");

export const syncLoaderFactory = (
  smartAPIID: string = undefined,
  teamName: string = undefined,
  tag: string = undefined,
  component: string = undefined,
  apiNames: string[] = undefined,
  path: string
): SmartAPISpec[] => {
  let loader;
  if (!(typeof smartAPIID === "undefined")) {
    loader = new SingleSpecSyncLoader(smartAPIID, path);
    debug("Using single spec sync loader now.");
  } else if (!(typeof teamName === "undefined")) {
    loader = new TeamSpecsSyncLoader(teamName, path);
    debug("Using team spec sync loader now.");
  } else if (!(typeof tag === "undefined")) {
    loader = new TagSpecsSyncLoader(tag, path);
    debug("Using tags spec sync loader now.");
  } else if (!(typeof component === "undefined")) {
    loader = new ComponentSpecsSyncLoader(component, path);
    debug("Using component spec sync loader now.");
  } else if (Array.isArray(apiNames)) {
    loader = new APINamesSpecsSyncLoader(apiNames, path);
    debug("Using api names spec sync loader now.");
  } else {
    loader = new AllSpecsSyncLoader(path);
    debug("Using all specs sync loader now.");
  }
  return loader.load();
};
