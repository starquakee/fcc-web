import { createBrowserRouter } from "react-router-dom";
import { SiteShell } from "./components/layout/SiteShell";
import { CvPage } from "./pages/CvPage";
import { HomePage } from "./pages/HomePage";
import { MemoryDetailPage } from "./pages/MemoryDetailPage";
import { MemoryPage } from "./pages/MemoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { PublicationsPage } from "./pages/PublicationsPage";
import { getRoutePath, routeManifest } from "./routeManifest";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SiteShell />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: getRoutePath("publications").slice(1), element: <PublicationsPage /> },
        { path: getRoutePath("projects").slice(1), element: <ProjectsPage /> },
        { path: getRoutePath("memory").slice(1), element: <MemoryPage /> },
        { path: getRoutePath("memoryDetail").slice(1), element: <MemoryDetailPage /> },
        { path: getRoutePath("cv").slice(1), element: <CvPage /> },
        { path: routeManifest.notFound.path, element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
