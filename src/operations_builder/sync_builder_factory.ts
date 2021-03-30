import SyncOperationsBuilder from "./sync_operations_builder";
import SyncOperationsBuilderWithReasoner from "./sync_operations_builder_with_reasoner";
import { BuilderOptions } from "../types";
import { SmartAPIKGOperationObject, SmartAPISpec } from "../parser/types";

export const syncBuilderFactory = (
  options: BuilderOptions,
  includeReasoner: boolean,
  smartapi_path: string,
  predicates_path: string
): SmartAPIKGOperationObject[] => {
  let builder;
  if (includeReasoner === true) {
    builder = new SyncOperationsBuilderWithReasoner(
      options,
      smartapi_path,
      predicates_path
    );
  } else {
    builder = new SyncOperationsBuilder(options, smartapi_path);
  }
  const ops = builder.build();
  return ops;
};
