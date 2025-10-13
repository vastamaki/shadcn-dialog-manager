import { DialogComponentProps } from "@/registry/default/dialog-manager/lib/dialog-manager/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExampleDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ExampleDialog({
  props,
  resolve,
  close,
}: DialogComponentProps<ExampleDialogProps, boolean>) {
  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => resolve(false)}>
            {props.cancelText || "Cancel"}
          </Button>
          <Button variant="destructive" onClick={() => resolve(true)}>
            {props.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
