// @flow
import type { Element, Node } from 'React';
import React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';

import Theming from './Theming.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

type Props = {|
  children: Node
|};

const useStyles = makeStyles((theme) => {
  return {
    main: {
      width: 'auto',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(1100 + theme.spacing(6))]: {
        width: 1100,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }
  };
});

export default function Layout({ children }: Props): Element<typeof Theming> {
  const classes = useStyles();
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Theming>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <meta charSet="utf-8" />
        <html lang="en" />
        <meta description="Joe Passmore is a painter based in Vancouver, British Columbia" />
        <meta keywords="artist, painter, paintings, gallery, Vancouver, British Columbia, Canada" />
      </Helmet>
      <Header title={data.site.siteMetadata.title} />
      <main className={classes.main}>{children}</main>
      <Footer />
    </Theming>
  );
}
