// @flow
import React from 'react';
import type { Element } from 'React';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  hero: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '64px 0 48px'
  }
});

export default function Hero(): Element<'div'> {
  const classes = useStyles();

  return (
    <div className={classes.hero}>
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
        Joe Passmore
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
        My work reflects what I see and admire in the world that we all live in, people and places that remain in my
        memory.
      </Typography>
    </div>
  );
}
