import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { Layout } from "./components/Layout"
import { Toaster } from "react-hot-toast"
import { Theme } from "@radix-ui/themes"

function App() {

  return (
    <>
    <Theme>
      <RecoilRoot>
        <Router>
          <Layout />
        </Router>
      </RecoilRoot>
</Theme>
      <Toaster
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App
