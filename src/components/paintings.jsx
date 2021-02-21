// @flow
import React from 'react';
import type { Element } from 'React';
import Img from 'gatsby-image';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

type Props = {|
  edges: [],
  onOpenModal: (number) => mixed
|};

const useStyles = makeStyles({
  paintings: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  thumbnail: {
    margin: 10,
    width: 300,
    height: 200,
    cursor: 'pointer'
  }
});

export default function Paintings({ edges, onOpenModal }: Props): Element<'div'> {
  const classes = useStyles();

  return (
    <div className={classes.paintings}>
      {edges.map(({ node }, index) => (
        <Paper key={index} className={classes.thumbnail} onClick={() => onOpenModal(index)}>
          <Img {...node.small} />
        </Paper>
      ))}
    </div>
  );
}
