"use client";

import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Plus, Briefcase, Vote } from "lucide-react";

interface ModalDialogProps {
  triggerLabel: string;
  triggerIcon: ReactNode;
  title: string;
  description: string;
  children: ReactNode; // form inputs
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  onCancel?: () => void;
  triggerVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  triggerClassName?: string;
}

export function ModalDialog({
  triggerLabel,
  triggerIcon,
  title,
  description,
  children,
  isSubmitting,
  onSubmit,
  onCancel,
  triggerVariant = "default",
  triggerClassName = "",
}: ModalDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const handleSubmit = async () => {
    await onSubmit();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className={`h-20 flex-col gap-2 ${triggerClassName}`}
        >
          {triggerIcon}
          <span>{triggerLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {triggerIcon}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">{children}</div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
