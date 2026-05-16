// @flow
import React from 'react';
import type { Element } from 'react';
import { Link } from 'gatsby';
import { Typography, AppBar, Toolbar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {|
  title: string
|};

const useStyles = makeStyles({
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
});

export default function Header({ title }: Props): Element<typeof AppBar> {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" color="inherit" noWrap className={classes.toolbarTitle}>
          <Link to="/" className={classes.headerLink}>
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
          className={classes.headerLink}
        >
          <Button color="inherit">Buy Now</Button>
        </a>
      </Toolbar>
    </AppBar>
  );
}
