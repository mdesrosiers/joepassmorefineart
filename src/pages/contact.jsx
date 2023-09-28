// @flow
import React from "react";
import type { Element } from "react";
import { useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import {css} from '@emotion/react'; 

import Layout from "../components/layout.jsx";

const contactStyle = css`
	marginTop: theme.spacing(8),
	display: "flex",
    aside: {
      flex: "0 0 400px",
      alignSelf: "flex-start"
    },
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    cardMedia: {
      paddingTop: "56.25%" // 16:9
    },
    article: {
      marginLeft: theme.spacing(5)
    }
`;

export default function Contact(): Element<typeof Layout> {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "paintings/028.jpg" }) {
        childImageSharp {
          fixed(width: 400, height: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <div css={contactStyle}>
        <aside>
          <Img {...data.file.childImageSharp} />
        </aside>
        <article>
          <h1>Contact</h1>
          <p>
            For paper prints or canvas prints or my paintings, visit my shop on Etsy:{" "}
            <OutboundLink
              href="https://www.etsy.com/ca/shop/joepassmorefineart"
              rel="noopener noreferrer"
              target="_blank"
            >
              joepassmorefineart
            </OutboundLink>
          </p>
          <p>
            Follow me on Instagram:{" "}
            <OutboundLink
              href="https://www.instagram.com/joepassmorefineart/"
              rel="noopener noreferrer"
              target="_blank"
            >
              @joepassmorefineart
            </OutboundLink>
          </p>
          <p>
            Find me on Facebook:{" "}
            <OutboundLink href="https://www.facebook.com/joe.passmore.33" rel="noopener noreferrer" target="_blank">
              joe.passmore.33
            </OutboundLink>
          </p>
        </article>
      </div>
    </Layout>
  );
}
