import { main as runBasicRagQueries } from "./basicRagQueries";
import { main as runToolCallsWithoutExecute } from "./toolCallsNoExecute";
import { main as runToolCallsWithExecute } from "./toolCallsWithExecute";

(async () => {
  await runBasicRagQueries();
  await runToolCallsWithoutExecute();
  await runToolCallsWithExecute();
})();
