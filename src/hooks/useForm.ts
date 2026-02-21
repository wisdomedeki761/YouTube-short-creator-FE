import { useForm as useReactHookForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const useForm = <T extends z.ZodType>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
): UseFormReturn<z.infer<T>> => {
  return useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T> | undefined,
  });
};

