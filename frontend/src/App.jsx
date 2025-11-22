import { Route, Routes } from "react-router-dom";
import Main from "./views/dashboard/Main";
import StatView from "./views/StatView";
import RedirectView from "./views/RedirectView";
import { useEffect } from "react";
import { useLinkStore } from "./store/links";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { getLinks } = useLinkStore();

  useEffect(() => {
    getLinks();
  }, [getLinks]);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:short_code" element={<RedirectView />} />
        <Route path="/code/:short_code" element={<StatView />} />
      </Routes>
    </>
  );
};

export default App;
