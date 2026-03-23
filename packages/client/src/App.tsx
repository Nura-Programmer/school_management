import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => setMessage("Error fetching API: " + error.message));
  }, []);

  return <h1>{message}</h1>;
}

export default App;
