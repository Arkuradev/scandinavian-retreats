import { useEffect, useState } from "react";
// There might be no use for this function. Remember to come back to delete this.
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
