import { useToastContext, type ToastAPI } from "@/components/ToastProvider";

export function useToast(): ToastAPI {
  return useToastContext();
}
