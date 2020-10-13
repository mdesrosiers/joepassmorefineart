// @flow
import React, { useState } from 'react';
import type { Element } from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Layout from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Paintings from '../components/Paintings.jsx';
import Modal from '../components/Modal.jsx';

const query = graphql`
  query {
    allFile(filter: { relativePath: { regex: "/paintings/" } }, sort: { fields: [name], order: DESC }) {
      edges {
        node {
          small: childImageSharp {
            fixed(width: 300, height: 200) {
              ...GatsbyImageSharpFixed
            }
          }
          large: childImageSharp {
            fluid(maxWidth: 900, maxHeight: 650) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default function Index(): Element<typeof StaticQuery> {
  const [modalOpened, setModalOpened] = useState(false);
  const [paintingIndex, setPaintingIndex] = useState(0);
  const handleOpenModal = (paintingIndex: number) => {
    setModalOpened(true);
    setPaintingIndex(paintingIndex);
  };

  return (
    <StaticQuery
      query={query}
      render={(data) => (
        <Layout>
          <Hero />
          <Paintings edges={data.allFile.edges} onOpenModal={handleOpenModal} />
          <Modal edge={data.allFile.edges[paintingIndex]} open={modalOpened} onClose={() => setModalOpened(false)} />
        </Layout>
      )}
    />
  );
}
