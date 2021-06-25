import { BuilderOptions } from "../types";
import { SmartAPIKGOperationObject, SmartAPISpec } from "../parser/types";
import API from "../parser/index";
import Debug from "debug";
const debug = Debug("bte:smartapi-kg:OperationsBuilder");

export default abstract class BaseOperationsBuilder {
  protected _options: BuilderOptions;

  constructor(options: BuilderOptions) {
    this._options = options;
  }

  protected loadOpsFromSpecs(
    specs: SmartAPISpec[]
  ): SmartAPIKGOperationObject[] {
    let allOps: SmartAPIKGOperationObject[] = [];
    specs.map((spec) => {
      try {
        const parser = new API(spec);
        const ops = parser.metadata.operations;
        allOps = [...allOps, ...ops];
      } catch (err) {
        debug(
          `[error]: Unable to parse spec, ${
            spec ? spec.info.title : spec
          }. Error message is ${err.toString()}`
        );
      }
    });
    return allOps;
  }

  abstract build():
    | SmartAPIKGOperationObject[]
    | Promise<SmartAPIKGOperationObject[]>;
}
