// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Hero() {
  <div style={getHeroContentStyle()}>
    <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
      Joe Passmore
    </Typography>
    <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
      My work reflects what I see and admire in the world that we all live in, people and places that remain in my
      memory.
    </Typography>
  </div>;
}

function getHeroContentStyle() {
  return {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '64px 0 48px'
  };
}
