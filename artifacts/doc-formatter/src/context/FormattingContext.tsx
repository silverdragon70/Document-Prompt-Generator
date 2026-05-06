import { createContext, useContext, ReactNode } from "react";
import { useFormattingState } from "@/hooks/useFormattingState";

type FormattingContextType = ReturnType<typeof useFormattingState>;

const FormattingContext = createContext<FormattingContextType | null>(null);

export function FormattingProvider({ children }: { children: ReactNode }) {
  const value = useFormattingState();
  return (
    <FormattingContext.Provider value={value}>
      {children}
    </FormattingContext.Provider>
  );
}

export function useFormatting() {
  const ctx = useContext(FormattingContext);
  if (!ctx) throw new Error("useFormatting must be used inside FormattingProvider");
  return ctx;
}
