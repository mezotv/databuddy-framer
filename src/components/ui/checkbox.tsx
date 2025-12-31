import type { ComponentPropsWithoutRef } from "react";

export function Checkbox(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} type="checkbox" />;
}
