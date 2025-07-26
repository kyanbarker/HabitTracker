import { useCallback } from "react";

export const useEditableField = <T extends Record<string, any>>(
  editValues: Record<number, T>,
  setEditValues: React.Dispatch<React.SetStateAction<Record<number, T>>>,
  onBlur: (id: number, data: Partial<T>) => void
) => {
  return useCallback(
    (id: number, fieldName: keyof T) => ({
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEditValues((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            [fieldName]: e.target.value,
          },
        })),
      onBlur: () =>
        onBlur(id, {
          [fieldName]: editValues[id]?.[fieldName] ?? "",
        } as Partial<T>),
    }),
    [editValues, setEditValues, onBlur]
  );
};
