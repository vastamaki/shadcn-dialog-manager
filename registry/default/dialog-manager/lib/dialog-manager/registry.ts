import { ExampleDialog } from "@/registry/default/dialog-manager/components/example-dialog";
import type { DialogDefinition } from "@/registry/default/dialog-manager/lib/dialog-manager/types";

export const dialogDefinitions = {
  example: {
    id: "example",
    component: ExampleDialog,
  },
} as const satisfies Record<string, DialogDefinition<any, any>>;
