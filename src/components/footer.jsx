// @flow
import React from 'react';
import type { Element } from 'react';
import { FaFacebook, FaEtsy, FaInstagram } from 'react-icons/fa';
import { Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {css} from '@emotion/react'; 

const footerStyle = css`
	padding: 40,
	bottomNavigation: {
		marginBottom: 25,
		backgroundColor: '#E1E2E1'
	}
`;

export default function Footer(): Element<'footer'> {
  return (
    <footer css={footerStyle}>
      <BottomNavigation>
        <BottomNavigationAction
          href="https://www.facebook.com/joe.passmore.33"
          rel="noopener noreferrer"
          target="_blank"
          icon={<FaFacebook />}
        />
        <BottomNavigationAction
          href="https://www.instagram.com/joepassmorefineart/"
          rel="noopener noreferrer"
          target="_blank"
          icon={<FaInstagram />}
        />
        <BottomNavigationAction
          href="https://www.etsy.com/ca/shop/joepassmorefineart"
          rel="noopener noreferrer"
          target="_blank"
          icon={<FaEtsy />}
        />
      </BottomNavigation>
      <Typography variant="caption" align="center" display="block" color="textSecondary">
        Copyright &copy; 2020 Joe Passmore. All Rights Reserved.
      </Typography>
    </footer>
  );
}
