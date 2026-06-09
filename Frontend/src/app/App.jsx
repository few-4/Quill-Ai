import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./app.store";
import { routes } from "./app.routes";
import { checkAuth } from "../features/auth/states/auth.slice";
import Navbar from "../components/Navbar";

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function AppShell() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a] text-white">
      {user && <Navbar />}
      <AppRoutes />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </Provider>
  );
}