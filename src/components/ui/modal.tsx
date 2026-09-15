"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Called on Escape, backdrop click or the close button. */
  onClose: () => void;
}

/**
 * Modal built on the native <dialog> element, which provides focus trapping
 * and an inert background. Open it by rendering it; close it by unmounting.
 * Mark the element that should receive focus with `data-autofocus`.
 */
export function Modal({
  title,
  description,
  children,
  footer,
  onClose,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Only a press that starts on the backdrop closes the modal, so selecting
  // text inside and releasing outside does not discard the form.
  const pressStartedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      // React's autoFocus runs before showModal(), which then moves focus to
      // the first button, so focus the intended field afterwards.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/40"
      // Escape is handled explicitly: not every browser fires "cancel" for it,
      // and preventing the keydown stops the native close so state stays in sync.
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressStartedOnBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-neutral">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-background px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}
