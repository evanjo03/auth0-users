import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/users",
    fetcher
  );
  console.log({ data });

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}

function App() {
  return (
    <div className="App">
      <Profile />
    </div>
  );
}

export default App;
