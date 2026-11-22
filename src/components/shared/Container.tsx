import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={["mx-auto w-full max-w-[1440px] px-4 md:px-5 lg:px-7 xl:px-8", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
