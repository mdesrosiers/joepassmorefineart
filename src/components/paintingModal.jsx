// @flow
import React from 'react';
import type { Element } from 'react';
import Img from 'gatsby-image';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

type Props = {|
  edge: {
    node: {
      large: {}
    }
  },
  open: boolean,
  onClose: () => mixed
|};

const useStyles = makeStyles((theme) => {
  return {
    modal: {
      position: 'absolute',
      top: 50,
      left: '50%',
      transform: 'translate(-50%)',
      width: 900,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5]
    }
  };
});

export default function PaintingModal({ open = false, edge, onClose }: Props): Element<typeof Modal> {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.modal}>
        <Img {...edge.node.large} />
      </div>
    </Modal>
  );
}
