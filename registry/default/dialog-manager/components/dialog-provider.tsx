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
  AnyDialogInstance,
  DialogDefinition,
  DialogComponent,
  TypedDialogRegistry,
  ExtractDialogProps,
  ExtractDialogResult,
} from "@/registry/default/dialog-manager/lib/dialog-manager/types";

interface DialogContextValue<
  TRegistry extends TypedDialogRegistry = TypedDialogRegistry
> {
  openDialog: <K extends keyof TRegistry>(
    dialogId: K,
    props?: ExtractDialogProps<TRegistry[K]["component"]>
  ) => Promise<ExtractDialogResult<TRegistry[K]["component"]>>;

  registry: Map<string, DialogDefinition>;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<AnyDialogInstance[]>([]);

  const registry = useMemo(() => {
    const map = new Map<string, DialogDefinition>();

    for (const [id, definition] of Object.entries(dialogDefinitions)) {
      if (map.has(id)) {
        console.warn(
          `Dialog with id "${id}" is already registered. Overwriting.`
        );
      }
      map.set(id, definition as unknown as DialogDefinition);
    }

    return map;
  }, []);

  const openDialog = useCallback(
    <TProps, TResult = unknown>(
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

        const submitHandler = (result: TResult) => {
          setDialogs((prev) => prev.filter((d) => d.id !== instanceId));
          resolve(result);
        };

        const cancelHandler = (reason?: string) => {
          setDialogs((prev) => prev.filter((d) => d.id !== instanceId));
          reject(new Error(reason || "Dialog cancelled"));
        };

        const instance: DialogInstance<TProps, TResult> = {
          id: instanceId,
          dialogId,
          component: dialogDef.component as DialogComponent<TProps, TResult>,
          props: props as TProps,
          submit: submitHandler,
          cancel: cancelHandler,
        };

        setDialogs((prev) => {
          const existingDialog = prev.find((d) => d.dialogId === dialogId);
          if (existingDialog) {
            reject(new Error(`Dialog "${dialogId}" is already open`));
            return prev;
          }

          return [...prev, instance as AnyDialogInstance];
        });
      });
    },
    [registry]
  );

  const contextValue = useMemo(
    () => ({
      openDialog,
      registry,
    }),
    [openDialog, registry]
  );

  const renderedDialogs = useMemo(
    () =>
      dialogs.map((dialog) => {
        const DialogComponent = dialog.component;
        return (
          <DialogComponent
            key={dialog.id}
            props={dialog.props}
            submit={dialog.submit}
            cancel={dialog.cancel}
          />
        );
      }),
    [dialogs]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {renderedDialogs}
    </DialogContext.Provider>
  );
}
