// @flow
import React from 'react';
import Img from 'gatsby-image';
import { StaticQuery, graphql } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/layout';

const query = graphql`
  query {
    file(relativePath: { eq: "paintings/003.jpg" }) {
      childImageSharp {
        fixed(width: 400, height: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

type Props = {|
  classes: { [string]: {} }
|};

const styles = (theme) => ({
  about: {
    marginTop: theme.spacing.unit * 8,
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
    marginLeft: theme.spacing.unit * 5
  }
});

function About({ classes }: Props) {
  <StaticQuery
    query={query}
    render={(data) => (
      <Layout>
        <div className={classes.about}>
          <aside className={classes.aside}>
            <Img {...data.file.childImageSharp} />
          </aside>
          <article className={classes.article}>
            <h1>About the Artist</h1>
            <p>
              Born in Scotland in 1945, I was influenced to paint by my brother, James, and at the age of 15 I did my
              first painting, a still life in water colour, since then I have painted in oils. The idea of creating a
              painting from start to finish gives me a real sense of accomplishment and satisfaction.
            </p>
            <p>
              In the sixties I spent some time in Corfu, Greece, where I painted some of my most memorable work. The
              sunsets and sunrises there gave me a feeling of peace and tranquility that I have tried to express in my
              paintings.
            </p>
          </article>
        </div>
      </Layout>
    )}
  />;
}

export default withStyles(styles)(About);
