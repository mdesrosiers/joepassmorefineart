// @flow

import * as React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';

import theme from '../utils/theme';
import Header from './header';
import Footer from './footer';

type Props = {
  classes: { [string]: {} },
  children: React.Node
};

const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const styles = theme => ({
  main: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
});

const Layout = ({ classes, children }: Props) => (
  <StaticQuery
    query={query}
    render={data => (
      <>
        <MuiThemeProvider theme={theme}>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: 'Joe Passmore is a painter based in Vancouver, British Columbia' },
              {
                name: 'keywords',
                content: 'artist, painter, paintings, gallery, Vancouver, British Columbia, Canada'
              }
            ]}
          >
            <html lang="en" />
          </Helmet>
          <Header title={data.site.siteMetadata.title} />
          <main className={classes.main}>{children}</main>
          <Footer />
        </MuiThemeProvider>
      </>
    )}
  />
);

export default withStyles(styles)(Layout);
