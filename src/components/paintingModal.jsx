// @flow

import React from 'react';
import Img from 'gatsby-image';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

type Props = {
  edge: {
    node: {
      large: {}
    }
  },
  open: boolean,
  classes: { [string]: {} },
  onClose: () => mixed
};

const styles = theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

const PaintingModal = ({ open = false, edge, onClose, classes }: Props) => (
  <Modal
    container={() => document.getElementById('___gatsby')}
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

export default withStyles(styles)(PaintingModal);
