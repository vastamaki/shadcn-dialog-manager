import { useContext } from "react";
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

  const openDialog = <K extends keyof DialogRegistryType>(
    dialogId: K,
    props?: ExtractDialogProps<DialogRegistryType[K]["component"]>
  ): Promise<ExtractDialogResult<DialogRegistryType[K]["component"]>> => {
    return context.openDialog(dialogId as string, props) as Promise<
      ExtractDialogResult<DialogRegistryType[K]["component"]>
    >;
  };

  return {
    openDialog,
    registry: context.registry,
  };
}
