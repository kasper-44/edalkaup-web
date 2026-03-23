/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.auto.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.cdnimg.com' },
    ],
  },
  async redirects() {
    return [
      // Preserve SEO from old WordPress site
      { source: '/okutaeki-um/', destination: '/um-okkur', permanent: true },
      { source: '/bilaleit/', destination: '/bilar', permanent: true },
      { source: '/soluskra/', destination: '/bilar', permanent: true },
      { source: '/inventory/', destination: '/bilar', permanent: true },
      { source: '/modern-inventory/', destination: '/bilar', permanent: true },
      { source: '/sold-inventory/', destination: '/afhent', permanent: true },
      { source: '/im-looking-for/', destination: '/hafa-samband', permanent: true },
      { source: '/service-appointment/', destination: '/hafa-samband', permanent: true },
      { source: '/contact/', destination: '/hafa-samband', permanent: true },
      { source: '/contact-us/', destination: '/hafa-samband', permanent: true },
      { source: '/contact-us-2/', destination: '/hafa-samband', permanent: true },
      { source: '/about/', destination: '/um-okkur', permanent: true },
      { source: '/about-us/', destination: '/um-okkur', permanent: true },
      { source: '/home-page/', destination: '/', permanent: true },
      { source: '/home-page-two/', destination: '/', permanent: true },
      { source: '/home-page-three/', destination: '/', permanent: true },
      { source: '/home-2/', destination: '/', permanent: true },
      // Catch-all for old listing pages
      { source: '/listing/:slug*', destination: '/afhent', permanent: true },
      // WordPress junk
      { source: '/blog-3/', destination: '/', permanent: true },
      { source: '/faq/', destination: '/', permanent: true },
      { source: '/compare/', destination: '/', permanent: true },
      { source: '/sell-a-car/', destination: '/', permanent: true },
      { source: '/our-services/', destination: '/', permanent: true },
      { source: '/support/', destination: '/', permanent: true },
      { source: '/dealers/', destination: '/', permanent: true },
      { source: '/dashboard/', destination: '/', permanent: true },
      { source: '/submit-listing/', destination: '/', permanent: true },
      { source: '/sell-us-your-car/', destination: '/', permanent: true },
      { source: '/finance/', destination: '/', permanent: true },
      { source: '/newsletter/', destination: '/', permanent: true },
      { source: '/shop/:slug*', destination: '/', permanent: true },
      { source: '/cart/:slug*', destination: '/', permanent: true },
      { source: '/checkout/:slug*', destination: '/', permanent: true },
      { source: '/my-account/:slug*', destination: '/', permanent: true },
      { source: '/sample-page/:slug*', destination: '/', permanent: true },
      { source: '/hello-world/:slug*', destination: '/', permanent: true },
      { source: '/download/', destination: '/', permanent: true },
      { source: '/find-your-favorite-car-in-a-minute/', destination: '/', permanent: true },
      { source: '/find-your-favorite-car-in-a-minute-1/', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
