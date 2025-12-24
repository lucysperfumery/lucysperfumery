import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your criteria.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-6 mb-4">
        <PackageOpen className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
        {description}
      </p>
    </div>
  );
}
