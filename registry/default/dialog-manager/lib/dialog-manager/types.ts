import { dialogDefinitions } from "@/registry/default/dialog-manager/lib/dialog-manager/registry";
import type { ReactNode } from "react";

export interface DialogComponentProps<TProps = unknown, TResult = unknown> {
  props: TProps;
  resolve: (result: TResult) => void;
  reject: (error?: Error) => void;
  close: () => void;
}

export type DialogComponent<TProps = unknown, TResult = unknown> = (
  props: DialogComponentProps<TProps, TResult>
) => ReactNode;

export interface DialogDefinition<TProps = unknown, TResult = unknown> {
  id: string;
  component: DialogComponent<TProps, TResult>;
}

export type ExtractDialogProps<T> = T extends DialogComponent<infer P, any>
  ? P extends void
    ? void
    : P
  : never;

export type ExtractDialogResult<T> = T extends DialogComponent<any, infer R>
  ? R
  : never;

export interface DialogInstance<TProps = unknown, TResult = unknown> {
  id: string;
  dialogId: string;
  component: DialogComponent<TProps, TResult>;
  props: TProps;
  resolve: (result: TResult) => void;
  reject: (error?: Error) => void;
}

export type TypedDialogRegistry = Record<string, DialogDefinition<any, any>>;

export type DialogRegistryType = typeof dialogDefinitions;
