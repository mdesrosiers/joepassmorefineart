// @flow
import React from 'react';
import { Link } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

type Props = {|
  title: string,
  classes: { [string]: {} }
|};

const styles = () => ({
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

function Header({ title, classes }: Props) {
  <AppBar className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Typography variant="h5" color="inherit" noWrap className={classes.toolbarTitle}>
        <Link to="/" className={classes.headerLink}>
          {title}
        </Link>
      </Typography>
      <Button color="inherit" component={Link} to="about">
        About
      </Button>
      <Button color="inherit" component={Link} to="contact">
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
  </AppBar>;
}

export default withStyles(styles)(Header);
