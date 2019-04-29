// @flow

import React from 'react';
import Img from 'gatsby-image';

import Paper from '@material-ui/core/Paper';

type Props = {
  edges: [],
  onOpenModal: number => mixed
};

const Paintings = ({ edges, onOpenModal }: Props) => (
  <div style={getPaintingsStyle()}>
    {edges.map(({ node }, index) => (
      <Paper key={index} style={getPaintingThumbnailStyle()} onClick={() => onOpenModal(index)}>
        <Img {...node.small} />
      </Paper>
    ))}
  </div>
);

function getPaintingsStyle(): {} {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  };
}

function getPaintingThumbnailStyle(): {} {
  return {
    margin: 10,
    width: 300,
    height: 200,
    cursor: 'pointer'
  };
}

export default Paintings;
