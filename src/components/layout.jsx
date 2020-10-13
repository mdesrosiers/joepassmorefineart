// @flow
import type { Element, Node } from 'React';
import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import Theming from './theming';
import Header from './header';
import Footer from './footer';

type Props = {|
  children: Node
|};

const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

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

export default function Layout({ children }: Props): Element<typeof StaticQuery> {
  const classes = useStyles();

  return (
    <StaticQuery
      query={query}
      render={(data) => (
        <>
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
          <Theming>
            <>
              <Header title={data.site.siteMetadata.title} />
              <main className={classes.main}>{children}</main>
              <Footer />
            </>
          </Theming>
        </>
      )}
    />
  );
}
