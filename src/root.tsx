// @refresh reload
import { Routes } from "solid-start/root";
import { ErrorBoundary } from "solid-start/error-boundary";
import { Suspense } from "solid-js";
import "./index.css";
import "./pro.fontawesome.js";

import Background from "~/components/Background";
import Navbar from "~/components/Navbar";
import Settings from "~/components/Settings";

export default function Root() {
  return (
    <>
      <ErrorBoundary>
        <Suspense>
          <Background />
          <Navbar />
          <Settings />
          <Routes />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
