import LoginPage from "../pages/auth/LoginPage";
import BrandPage from "../pages/brand/BrandPage";
import CategoryPage from "../pages/category/CategoryPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import ProductPage from "../pages/product/ProductPage";

const routes = [
  {
    path: "/",
    name: "login",
    page: LoginPage,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    page: DashboardPage,
  },
  {
    path: "/brand",
    name: "brand",
    page: BrandPage,
  },
  {
    path: "/category",
    name: "category",
    page: CategoryPage,
  },
  {
    path: "/product",
    name: "product",
    page: ProductPage,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
export { routes };
