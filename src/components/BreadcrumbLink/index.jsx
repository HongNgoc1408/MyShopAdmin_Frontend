import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export const itemRender = (currentRoute, params, items, paths) => {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return isLast ? (
    <span>{currentRoute.title}</span>
  ) : (
    <Link to={`${paths.join("/") || "/"}`}>{currentRoute.title}</Link>
  );
};

export default function BreadcrumbLink({ breadcrumb }) {
  return <Breadcrumb itemRender={itemRender} items={breadcrumb} />;
}
