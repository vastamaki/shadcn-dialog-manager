"use client";

import {
  createContext,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { dialogDefinitions } from "@/registry/default/dialog-manager/lib/dialog-manager/registry";
import type {
  DialogInstance,
  DialogDefinition,
  TypedDialogRegistry,
  ExtractDialogProps,
  ExtractDialogResult,
} from "@/registry/default/dialog-manager/lib/dialog-manager/types";

interface DialogContextValue<TRegistry extends TypedDialogRegistry = any> {
  openDialog: <K extends keyof TRegistry>(
    dialogId: K,
    ...args: ExtractDialogProps<TRegistry[K]["component"]> extends void
      ? []
      : [props: ExtractDialogProps<TRegistry[K]["component"]>]
  ) => Promise<ExtractDialogResult<TRegistry[K]["component"]>>;
  closeDialog: (instanceId: string) => void;
  closeAllDialogs: () => void;
  registry: Map<string, DialogDefinition>;
}

export const DialogContext = createContext<DialogContextValue<any> | null>(
  null
);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogInstance<any, any>[]>([]);

  // Create memoized registry from dialog definitions
  const registry = useMemo(() => {
    const map = new Map<string, DialogDefinition<any, any>>();

    for (const [id, definition] of Object.entries(dialogDefinitions)) {
      if (map.has(id)) {
        console.warn(
          `Dialog with id "${id}" is already registered. Overwriting.`
        );
      }
      map.set(id, definition as DialogDefinition<any, any>);
    }

    return map;
  }, []);

  const openDialog = useCallback(
    <TProps = void, TResult = unknown>(
      dialogId: string,
      props?: TProps
    ): Promise<TResult> => {
      return new Promise<TResult>((resolve, reject) => {
        const dialogDef = registry.get(dialogId);

        if (!dialogDef) {
          reject(new Error(`Dialog "${dialogId}" not found in registry`));
          return;
        }

        const instanceId = `${dialogId}-${Date.now()}-${Math.random()}`;

        const instance: DialogInstance<any, any> = {
          id: instanceId,
          dialogId,
          component: dialogDef.component as any,
          props: props as any,
          resolve: (result: any) => {
            setDialogs((prev) => prev.filter((d) => d.id !== instanceId));
            resolve(result);
          },
          reject: (error?: Error) => {
            setDialogs((prev) => prev.filter((d) => d.id !== instanceId));
            reject(error || new Error("Dialog rejected"));
          },
        };

        setDialogs((prev) => [...prev, instance]);
      });
    },
    [registry]
  );

  const closeDialog = useCallback((instanceId: string) => {
    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === instanceId);
      if (dialog) {
        dialog.reject(new Error("Dialog closed manually"));
      }
      return prev.filter((d) => d.id !== instanceId);
    });
  }, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs((prev) => {
      prev.forEach((dialog) => {
        dialog.reject(new Error("All dialogs closed"));
      });
      return [];
    });
  }, []);

  return (
    <DialogContext.Provider
      value={{
        openDialog: openDialog as any,
        closeDialog,
        closeAllDialogs,
        registry,
      }}
    >
      {children}
      {dialogs.map((dialog) => {
        const Component = dialog.component;
        return (
          <Component
            key={dialog.id}
            props={dialog.props}
            resolve={dialog.resolve}
            reject={dialog.reject}
            close={() => closeDialog(dialog.id)}
          />
        );
      })}
    </DialogContext.Provider>
  );
}
