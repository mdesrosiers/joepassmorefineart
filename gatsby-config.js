const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Joe Passmore',
    siteUrl: 'https://joepassmorefineart.com'
  },
  plugins: [
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png'
      }
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.join(__dirname, 'src', 'images')
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-127331168-1',
        optimizeId: 'GTM-M2ZM6SB',
        cookieDomain: 'joepassmorefineart.com'
      }
    },
    'gatsby-plugin-eslint',
    'gatsby-plugin-flow',
    'gatsby-plugin-offline',
    'gatsby-plugin-netlify'
  ]
};
