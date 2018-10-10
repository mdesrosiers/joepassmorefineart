const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Joe Passmore'
  },
  plugins: [
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
        icon: 'src/images/gatsby-icon.png'
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
        trackingId: 'UA-127123065-1',
        optimizeId: 'GTM-MNTFDZL',
        cookieDomain: 'jpassmorefineart.com'
      }
    },
    'gatsby-plugin-eslint',
    'gatsby-plugin-flow',
    'gatsby-plugin-offline',
    'gatsby-plugin-netlify'
  ]
};
