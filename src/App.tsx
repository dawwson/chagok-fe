import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import reset from "styled-reset";

import LoadingScreen from "./components/organisms/LoadingScreen";
import { lightTheme } from "./configs/theme";

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
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </ThemeProvider>
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

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.background.light_blue};
    color: ${({ theme }) => theme.text.primary};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

export default App;
