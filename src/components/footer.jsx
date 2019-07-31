// @flow

import React from 'react';
import { Etsy, Facebook, Instagram } from 'mdi-material-ui';

import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const Footer = () => (
  <footer style={getFooterStyle()}>
    <BottomNavigation style={getBottomNavigationStyle()}>
      <BottomNavigationAction
        href="https://www.facebook.com/joe.passmore.33"
        rel="noopener noreferrer"
        target="_blank"
        icon={<Facebook />}
      />
      <BottomNavigationAction
        href="https://www.instagram.com/joepassmorefineart/"
        rel="noopener noreferrer"
        target="_blank"
        icon={<Instagram />}
      />
      <BottomNavigationAction
        href="https://www.etsy.com/ca/shop/joepassmorefineart"
        rel="noopener noreferrer"
        target="_blank"
        icon={<Etsy />}
      />
    </BottomNavigation>
    <Typography variant="caption" align="center" display="block" color="textSecondary">
      Copyright &copy; 2019 Joe Passmore. All Rights Reserved.
    </Typography>
  </footer>
);

function getFooterStyle() {
  return {
    padding: 40
  };
}

function getBottomNavigationStyle() {
  return {
    marginBottom: 25,
    backgroundColor: '#E1E2E1'
  };
}

export default Footer;
