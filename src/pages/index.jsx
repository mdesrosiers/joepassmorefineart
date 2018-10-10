// @flow

import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout';
import Hero from '../components/hero';
import Paintings from '../components/paintings';
import PaintingModal from '../components/paintingModal';

const query = graphql`
  query {
    allFile(filter: { relativePath: { regex: "/paintings/" } }, sort: { fields: [birthTime], order: DESC }) {
      edges {
        node {
          small: childImageSharp {
            fixed(width: 300, height: 200) {
              ...GatsbyImageSharpFixed
            }
          }
          large: childImageSharp {
            fluid(maxWidth: 1200, maxHeight: 900) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

type Props = {
  edges: []
};

type State = {
  modalOpened: boolean,
  paintingIndex: number
};

export default class Index extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpened: false,
      paintingIndex: 0
    };
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <Layout>
            <Hero />
            <Paintings edges={data.allFile.edges} onOpenModal={this.handleOpenModal.bind(this)} />
            {this.renderModal(data.allFile.edges)}
          </Layout>
        )}
      />
    );
  }

  renderModal(edges: []) {
    if (this.state.modalOpened) {
      const edge = edges[this.state.paintingIndex];
      return <PaintingModal edge={edge} open={this.state.modalOpened} onClose={this.handleCloseModal.bind(this)} />;
    }
  }

  handleOpenModal(paintingIndex: number) {
    this.setState({ modalOpened: true, paintingIndex });
  }

  handleCloseModal() {
    this.setState({ modalOpened: false });
  }
}
