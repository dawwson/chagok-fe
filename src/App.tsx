import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoadingScreen from "./components/organisms/LoadingScreen";

import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import AddEntryPage from "./pages/AddEntryPage";
import ManageBudgetPage from "./pages/ManageBudgetPage";
import StatsPage from "./pages/StatsPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}</>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/add-entry",
        element: <AddEntryPage />,
      },
      {
        path: "/manage-budget",
        element: <ManageBudgetPage />,
      },
      {
        path: "/stats",
        element: <StatsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/join",
    element: <JoinPage />,
  },
]);

export default App;
