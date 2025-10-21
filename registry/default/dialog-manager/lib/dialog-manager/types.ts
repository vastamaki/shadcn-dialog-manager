import { dialogDefinitions } from "@/registry/default/dialog-manager/lib/dialog-manager/registry";
import type { ReactNode } from "react";

export interface DialogComponentProps<TProps = unknown, TResult = unknown> {
  props: TProps;
  submit: (result: TResult) => void;
  cancel: (reason?: string) => void;
}

export type DialogComponent<TProps = unknown, TResult = unknown> = (
  props: DialogComponentProps<TProps, TResult>
) => ReactNode;

export interface DialogDefinition<TProps = unknown, TResult = unknown> {
  id: string;
  component: DialogComponent<TProps, TResult>;
}

export type ExtractDialogProps<T> = T extends DialogComponent<infer P, infer _>
  ? P extends void
    ? undefined
    : P
  : never;

export type ExtractDialogResult<T> = T extends DialogComponent<infer _, infer R>
  ? R
  : never;

export interface DialogInstance<TProps = unknown, TResult = unknown> {
  id: string;
  dialogId: string;
  component: DialogComponent<TProps, TResult>;
  props: TProps;
  submit: (result: TResult) => void;
  cancel: (reason?: string) => void;
}

export type AnyDialogInstance = DialogInstance<unknown, unknown>;

export type TypedDialogRegistry = Record<string, DialogDefinition>;

export type DialogRegistryType = typeof dialogDefinitions;
