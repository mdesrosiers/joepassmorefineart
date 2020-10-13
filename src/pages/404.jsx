// @flow
import React from 'react';
import type { Node } from 'React';
import Layout from '../components/layout';

export default function NotFoundPage(): Node {
  return (
    <Layout>
      <h1>Not Found</h1>
      <p>This page doesn&#39;t exist.</p>
    </Layout>
  );
}
