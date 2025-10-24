interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" class="mb-4">
      <ol class="flex overflow-hidden rounded border border-gray-300 bg-white text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} class={isLast ? "" : "relative flex items-center"}>
              {isLast ? (
                <span class="block h-10 bg-gray-100 px-4 leading-10 dark:bg-gray-700">
                  {item.title}
                </span>
              ) : (
                <>
                  <a
                    href={item.href}
                    class="block h-10 bg-gray-100 px-4 leading-10 transition-colors hover:text-gray-900 dark:bg-gray-700 dark:hover:text-white"
                  >
                    {item.title}
                  </a>
                  <span class="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 flex items-center justify-center text-gray-500 dark:bg-gray-700 dark:text-gray-400">▶</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}