import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { polyTag, wrapperDepth, noiseAttrs, hashedClass } from "@/lib/obfuscate";
import clsx from "clsx";

type DynProps = HTMLAttributes<HTMLElement> & {
  as?: string;
  tagKey?: string;
  children?: ReactNode;
};

export function Dyn({ as, tagKey, children, className, ...rest }: DynProps) {
  const tag = as ?? (tagKey ? polyTag(tagKey) : "div");
  return createElement(tag, { className, ...rest }, children);
}

type WrapProps = {
  wrapKey: string;
  className?: string;
  children: ReactNode;
};

export function Wrap({ wrapKey, className, children }: WrapProps) {
  const depth = wrapperDepth(wrapKey);
  let node: ReactNode = children;
  for (let i = 0; i < depth; i++) {
    const inner = node;
    const localKey = `${wrapKey}::w${i}`;
    const tag = polyTag(localKey);
    const attrs = noiseAttrs(localKey, 1);
    const cls = hashedClass(localKey);
    node = createElement(
      tag,
      { className: clsx(cls, i === depth - 1 ? className : undefined), ...attrs },
      inner,
    );
  }
  if (depth === 0 && className) {
    node = createElement("div", { className }, children);
  }
  return <>{node}</>;
}
