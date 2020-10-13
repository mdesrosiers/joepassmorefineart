// @flow
import React from 'react';
import type { Element } from 'React';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/layout';

const query = graphql`
  query {
    file(relativePath: { eq: "paintings/028.jpg" }) {
      childImageSharp {
        fixed(width: 400, height: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => {
  return {
    contact: {
      marginTop: theme.spacing(8),
      display: 'flex'
    },
    aside: {
      flex: '0 0 400px',
      alignSelf: 'flex-start'
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    cardMedia: {
      paddingTop: '56.25%' // 16:9
    },
    article: {
      marginLeft: theme.spacing(5)
    }
  };
});

export default function Contact(): Element<typeof StaticQuery> {
  const classes = useStyles();

  return (
    <StaticQuery
      query={query}
      render={(data) => (
        <Layout>
          <div className={classes.contact}>
            <aside className={classes.aside}>
              <Img {...data.file.childImageSharp} />
            </aside>
            <article className={classes.article}>
              <h1>Contact</h1>
              <p>
                For paper prints or canvas prints or my paintings, visit my shop on Etsy:{' '}
                <OutboundLink
                  href="https://www.etsy.com/ca/shop/joepassmorefineart"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  joepassmorefineart
                </OutboundLink>
              </p>
              <p>
                Follow me on Instagram:{' '}
                <OutboundLink
                  href="https://www.instagram.com/joepassmorefineart/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @joepassmorefineart
                </OutboundLink>
              </p>
              <p>
                Find me on Facebook:{' '}
                <OutboundLink href="https://www.facebook.com/joe.passmore.33" rel="noopener noreferrer" target="_blank">
                  joe.passmore.33
                </OutboundLink>
              </p>
            </article>
          </div>
        </Layout>
      )}
    />
  );
}
