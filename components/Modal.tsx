import { useEffect, useRef, useState } from "preact/hooks";

interface ModalProps {
  show: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeable?: boolean;
  onClose: () => void;
  children: preact.ComponentChildren;
}

export default function Modal({
  show,
  maxWidth = "2xl",
  closeable = true,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showSlot, setShowSlot] = useState(show);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      setShowSlot(true);
      dialogRef.current?.showModal();
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        dialogRef.current?.close();
        setShowSlot(false);
      }, 200);
    }
  }, [show]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show && closeable) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [show, closeable, onClose]);

  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[maxWidth];

  return (
    <dialog
      ref={dialogRef}
      class="z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent"
    >
      <div
        class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50"
        scroll-region
      >
        <div
          class={`fixed inset-0 transform transition-all ${
            show ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeable ? onClose : undefined}
        >
          <div class="absolute inset-0 bg-gray-500 dark:bg-black opacity-75 dark:opacity-75" />
        </div>

        <div
          class={`mb-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:w-full sm:mx-auto ${maxWidthClass} ${
            show
              ? "opacity-100 translate-y-0 sm:scale-100"
              : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          }`}
        >
          {showSlot && children}
        </div>
      </div>
    </dialog>
  );
}
