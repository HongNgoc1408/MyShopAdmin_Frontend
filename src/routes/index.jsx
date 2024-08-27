import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/notFound/NotFoundPage";

const routes = [
  {
    path: "/",
    page: DashboardPage,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
export { routes };
