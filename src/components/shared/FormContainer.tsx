import { type ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
  className?: string;
}

export default function FormContainer({
  children,
  className = "",
}: Readonly<FormContainerProps>) {
  return (
    <div
      className={`
        w-full
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        pb-[env(safe-area-inset-bottom)]
      `}
    >
      <div
        className={`
          w-full
          max-w-2xl
          mx-auto
          rounded-2xl
          border
          bg-white dark:bg-neutral-800
          border-slate-200 dark:border-neutral-700
          p-5 sm:p-6 lg:p-8
          shadow-sm
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
