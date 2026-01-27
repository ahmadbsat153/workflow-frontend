"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type FormEditContextType = {
  isFormDirty: boolean;
  isWorkflowDirty: boolean;
  setFormDirty: (dirty: boolean) => void;
  setWorkflowDirty: (dirty: boolean) => void;
  isDirty: boolean;
};

const FormEditContext = createContext<FormEditContextType | undefined>(undefined);

export const FormEditProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isWorkflowDirty, setIsWorkflowDirty] = useState(false);

  const setFormDirty = useCallback((dirty: boolean) => {
    setIsFormDirty(dirty);
  }, []);

  const setWorkflowDirty = useCallback((dirty: boolean) => {
    setIsWorkflowDirty(dirty);
  }, []);

  const isDirty = isFormDirty || isWorkflowDirty;

  return (
    <FormEditContext.Provider
      value={{
        isFormDirty,
        isWorkflowDirty,
        setFormDirty,
        setWorkflowDirty,
        isDirty,
      }}
    >
      {children}
    </FormEditContext.Provider>
  );
};

export const useFormEditContext = () => {
  const context = useContext(FormEditContext);
  if (context === undefined) {
    throw new Error("useFormEditContext must be used within a FormEditProvider");
  }
  return context;
};
