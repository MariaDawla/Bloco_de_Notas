import { useEffect, useState } from "react";
import "./App.css";
import { DraggableWindow } from "./components/DraggableWindow";
import { ToolBar } from "./components/ToolBar";
import { WindowContent } from "./components/WindowContent";
import api from "./service/api";

function App() {
  const [windows, setWindows] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  async function fetchPages() {
    try {
      const response = await api.get("/listarJanelas");

      setWindows(
        response.data.map((window) => {
          return {
            pages: window.paginas.map((page) => {
              return {
                id: page.id,
                title: page.titulo,
                textContent: page.conteudo,
                type: page.tipo,
              };
            }),
          };
        })
      );

      setSelectedPages(new Array(response.data.length).fill(0));
    } catch (error) {
      console.error("Error fetching pages", error);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="App">
      <div className="background" />
      <div className="container">
        {windows.map((window, idx) => (
          <DraggableWindow
            windowPages={window.pages}
            selectedPage={selectedPages[idx]}
            setSelectedPage={(value) => {
              let previousPages = [...selectedPages];
              previousPages[idx] = value;
              setSelectedPages(previousPages);
            }}
          >
            <ToolBar />
            <WindowContent
              content={windows[idx].pages[selectedPages[idx]]?.textContent}
              setContent={(value) => {
                let previousWindows = [...windows];
                previousWindows[idx].pages[selectedPages[idx]].textContent =
                  value;
                setWindows(previousWindows);
              }}
              page={windows[idx].pages[selectedPages[idx]]}
            />
          </DraggableWindow>
        ))}
      </div>
    </div>
  );
}

export default App;
