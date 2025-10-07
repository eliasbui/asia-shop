"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorBoxProps {
  error?: Error | string | null;
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function ErrorBox({
  error,
  title,
  message,
  code,
  onRetry,
  className,
  showDetails = false,
}: ErrorBoxProps) {
  const t = useTranslations();

  const errorMessage =
    message ||
    (error instanceof Error ? error.message : error) ||
    t("common.somethingWentWrong");

  const errorTitle = title || t("common.error");

  return (
    <Card
      className={cn(
        "border-destructive/50 bg-destructive/5 p-6",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        
        <h3 className="text-lg font-semibold text-destructive mb-2">
          {errorTitle}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {errorMessage}
        </p>

        {code && (
          <p className="text-xs text-muted-foreground mb-4">
            {t("common.error")} Code: {code}
          </p>
        )}

        {showDetails && error instanceof Error && error.stack && (
          <details className="w-full mb-4">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Show details
            </summary>
            <pre className="mt-2 text-xs text-left bg-muted p-2 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}

        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("common.retry")}
          </Button>
        )}
      </div>
    </Card>
  );
}
