import { cn } from "@/lib/utils";

const Breadcrumb = ({ items }) => (
  <nav className="text-sm text-gray-600 mb-4">
    <ol className="list-reset flex">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <a
            href={item.href}
            className={cn(
              "hover:underline",
              index === items.length - 1 ? "font-semibold text-black" : ""
            )}
          >
            {item.label}
          </a>
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;