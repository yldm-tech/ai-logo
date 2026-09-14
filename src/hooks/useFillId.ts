import { kebabCase } from "es-toolkit";
import { useId, useMemo } from "react";

export const useFillId = (namespace: string) => {
  const uniqueId = useId();
  const id = `ai-logo-${kebabCase(namespace)}-${uniqueId}`;
  return useMemo(
    () => ({
      fill: `url(#${id})`,
      id,
    }),
    [namespace, uniqueId],
  );
};

export const useFillIds = (namespace: string, length: number) => {
  const uniqueId = useId();
  return useMemo(() => {
    return Array.from({ length }, (_, i) => {
      const id = `ai-logo-${kebabCase(namespace)}-${i}-${uniqueId}`;
      return {
        fill: `url(#${id})`,
        id,
      };
    });
  }, [namespace, length, uniqueId]);
};
