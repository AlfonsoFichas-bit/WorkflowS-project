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
    <nav aria-label="breadcrumb">
      <ol class="flex items-center space-x-3 text-base text-gray-500 dark:text-gray-400 mb-4">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} class="flex items-center">
              {isLast ? (
                <span class="font-semibold text-xl text-gray-900 dark:text-gray-100">{item.title}</span>
              ) : (
                <a href={item.href} class="text-xl hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {item.title}
                </a>
              )}
              {!isLast && <span class="mx-3 text-gray-400 dark:text-gray-500">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}