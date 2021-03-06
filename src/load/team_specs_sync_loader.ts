import AllSpecsSyncLoader from "./all_specs_sync_loader";
import { SmartAPIQueryResult } from "../types";
import { SmartAPISpec } from "../parser/types";

export default class TeamSpecsSyncLoader extends AllSpecsSyncLoader {
  private _teamName: string;

  constructor(teamName: string, path: string) {
    super(path);
    this._teamName = teamName;
  }

  parse(input: SmartAPIQueryResult): SmartAPISpec[] {
    return input.hits.filter(
      (item) =>
        "x-translator" in item.info &&
        "team" in item.info["x-translator"] &&
        Array.isArray(item.info["x-translator"].team) &&
        item.info["x-translator"].team.includes(this._teamName)
    );
  }
}
