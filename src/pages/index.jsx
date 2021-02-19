// @flow
import React from 'react';
import { useState } from 'react';
import type { Element } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Paintings from '../components/Paintings.jsx';
import Modal from '../components/Modal.jsx';

export default function Index(): Element<typeof Layout> {
  const [modalOpened, setModalOpened] = useState(false);
  const [paintingIndex, setPaintingIndex] = useState(0);
  const handleOpenModal = (paintingIndex: number) => {
    setModalOpened(true);
    setPaintingIndex(paintingIndex);
  };
  const data = useStaticQuery(graphql`
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
  `);

  return (
    <Layout>
      <Hero />
      <Paintings edges={data.allFile.edges} onOpenModal={handleOpenModal} />
      <Modal edge={data.allFile.edges[paintingIndex]} open={modalOpened} onClose={() => setModalOpened(false)} />
    </Layout>
  );
}
