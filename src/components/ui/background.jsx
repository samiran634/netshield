import React from "react";
import { cn } from "../../../lib/utils/utils";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `absolute -inset-[10px] opacity-50 will-change-transform
              bg-[length:300%_200%] bg-[position:50%_50%,50%_50%]
              filter blur-[10px] invert dark:invert-0 pointer-events-none
              animate-aurora`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
            )}
            style={{
              backgroundImage: `
                repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, transparent 10%, transparent 12%, var(--white) 16%),
                repeating-linear-gradient(100deg, var(--blue-500) 10%, var(--indigo-300) 15%, var(--blue-300) 20%, var(--violet-200) 25%, var(--blue-400) 30%)
              `,
            }}
          >
            <div 
              className="absolute inset-0 mix-blend-difference"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, transparent 10%, transparent 12%, var(--white) 16%),
                  repeating-linear-gradient(100deg, var(--blue-500) 10%, var(--indigo-300) 15%, var(--blue-300) 20%, var(--violet-200) 25%, var(--blue-400) 30%)
                `,
                backgroundSize: "200% 100%",
                backgroundAttachment: "fixed"
              }}
            ></div>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};