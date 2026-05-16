// @flow
import React from "react";
import type { Element } from "react";

import Layout from "../components/layout.jsx";

export default function NotFound(): Element<typeof Layout> {
  return (
    <Layout>
      <h1>Not Found</h1>
      <p>This page doesn&#39;t exist.</p>
    </Layout>
  );
}
