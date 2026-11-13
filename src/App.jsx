import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { usePageControllers } from "./runtime/use-page-controllers.js";

export default function App({ route }) {
  usePageControllers(route.page, route.controllers);
  const Page = route.Component;
  return (
    <>
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      {route.page !== "home" && <Navbar page={route.page} />}
      <Page />
      {route.page !== "home" && <Footer page={route.page} />}
    </>
  );
}
