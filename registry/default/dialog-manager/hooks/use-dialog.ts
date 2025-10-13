import { useContext, useCallback } from "react";
import { DialogContext } from "@/registry/default/dialog-manager/components/dialog-provider";
import type {
  DialogRegistryType,
  ExtractDialogProps,
  ExtractDialogResult,
} from "@/registry/default/dialog-manager/lib/dialog-manager/types";

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  const openDialog = useCallback(
    async <K extends keyof DialogRegistryType>(
      dialogId: K,
      ...args: ExtractDialogProps<
        DialogRegistryType[K]["component"]
      > extends void
        ? []
        : [props: ExtractDialogProps<DialogRegistryType[K]["component"]>]
    ): Promise<ExtractDialogResult<DialogRegistryType[K]["component"]>> => {
      try {
        return (await context.openDialog(
          dialogId as string,
          args[0]
        )) as ExtractDialogResult<DialogRegistryType[K]["component"]>;
      } catch (error) {
        console.error(`Failed to open dialog "${String(dialogId)}":`, error);
        throw error;
      }
    },
    [context]
  );

  const closeDialog = useCallback(
    (instanceId: string, force = false) => {
      if (force) {
        context.closeDialog(instanceId);
      } else {
        // Add a small delay to allow for animations
        setTimeout(() => context.closeDialog(instanceId), 100);
      }
    },
    [context]
  );

  const closeAllDialogs = useCallback(
    (force = false) => {
      if (force) {
        context.closeAllDialogs();
      } else {
        // Add a small delay to allow for animations
        setTimeout(() => context.closeAllDialogs(), 100);
      }
    },
    [context]
  );

  return {
    openDialog,
    closeDialog,
    closeAllDialogs,
  };
}
