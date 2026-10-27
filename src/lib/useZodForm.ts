import { useCallback, useState } from "react";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

type Schema extends z.ZodType<FieldValues, any>;

/**
 * Thin RHF hook: resolver + mode tuned for auth forms.
 * Errors clear on change (via shouldFocusError + revalidation modes below).
 */
export function useZodForm<T extends Schema>(schema: T, defaultValues?: z.input<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
}

/** Map RHF field state → TextField props in one call. */
export function useField(form: UseFormReturn<any>, name: string) {
  const field = form.register(name);
  const error = form.formState.errors[name]?.message as string | undefined;
  const clear = useCallback(() => {
    if (error) form.clearErrors(name);
  }, [error, form, name]);
  return { field, error, clear };
}
