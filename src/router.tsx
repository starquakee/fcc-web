import { createBrowserRouter } from "react-router-dom";
import { SiteShell } from "./components/layout/SiteShell";
import { CvPage } from "./pages/CvPage";
import { HomePage } from "./pages/HomePage";
import { MemoryDetailPage } from "./pages/MemoryDetailPage";
import { MemoryPage } from "./pages/MemoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { PublicationsPage } from "./pages/PublicationsPage";
import { WritingPage } from "./pages/WritingPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SiteShell />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "publications", element: <PublicationsPage /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "writing", element: <WritingPage /> },
        { path: "memory", element: <MemoryPage /> },
        { path: "memory/:slug", element: <MemoryDetailPage /> },
        { path: "cv", element: <CvPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
