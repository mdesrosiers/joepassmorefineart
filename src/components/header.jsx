// @flow
import React from 'react';
import type { Element } from 'react';
import { Link } from 'gatsby';
import { Typography, AppBar, Toolbar, Button } from '@mui/material';
import {css} from '@emotion/react'; 

type Props = {|
  title: string
|};

const headerStyle = css`
  appBar: {
    position: 'relative'
  },
  toolbar: {
    paddingRight: 24
  },
  toolbarTitle: {
    flex: 1
  },
  headerLink: {
    textDecoration: 'none',
    color: 'inherit'
  }
`;

export default function Header({ title }: Props): Element<typeof AppBar> {
  return (
    <AppBar css={headerStyle}>
      <Toolbar>
        <Typography variant="h5" color="inherit" noWrap>
          <Link to="/">
            {title}
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contact
        </Button>
        <a
          href="https://www.etsy.com/ca/shop/joepassmorefineart"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button color="inherit">Buy Now</Button>
        </a>
      </Toolbar>
    </AppBar>
  );
}
