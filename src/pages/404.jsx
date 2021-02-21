// @flow
import React from 'react';
import type { Element } from 'React';

import Layout from '../components/Layout.jsx';

export default function NotFound(): Element<typeof Layout> {
  return (
    <Layout>
      <h1>Not Found</h1>
      <p>This page doesn&#39;t exist.</p>
    </Layout>
  );
}
