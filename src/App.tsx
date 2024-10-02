import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import reset from "styled-reset";

import { lightTheme } from "./configs/theme";
import { AuthProvider } from "./contexts/auth";
import MainLayout from "./components/templates/MainLayout";
import PrivateRoute from "./components/templates/PrivateRoute";

import HomePage from "./pages/HomePage";
import ManageTransactionPage from "./pages/ManageTransactionPage";
import ProfilePage from "./pages/ProfilePage";
import ManageBudgetPage from "./pages/ManageBudgetPage";
import StatsPage from "./pages/StatsPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import AuthLayout from "./components/templates/AuthLayout";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/add-transaction",
        element: <ManageTransactionPage />,
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
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/join",
    element: (
      <AuthLayout>
        <JoinPage />
      </AuthLayout>
    ),
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
