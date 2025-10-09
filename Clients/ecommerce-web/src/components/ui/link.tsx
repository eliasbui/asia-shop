import NextLink from "next/link";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Link = ({ href, children, className, ...props }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={cn(
        "text-primary hover:underline underline-offset-4",
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};