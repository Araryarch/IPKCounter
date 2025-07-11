import { getMetadataItems } from '@/lib/getMetadataItems'

const metadataItems = getMetadataItems()

export const BASE_METADATA = {
  title: metadataItems.title,
  description: metadataItems.description,
  creator: 'IP COUNTER RPL 2024 Web Team',
  publisher: 'IP COUNTER RPL 2024 Web Team',
  keywords: [
    'IP COUNTER RPL',
    'IP COUNTER RPL 2024',
    'IP COUNTER RPL',
    'IP COUNTER RPL',
    'IP COUNTER RPL 2024 Web Team',
    'IP COUNTER RPL ITS',
    'IP COUNTER RPL',
    'IP COUNTER RPL 2024 Web Team',
    'Institut Teknologi Sepuluh Nopember',
    'Institut Teknologi Sepuluh Nopember 2024',
  ],
  robots: 'follow, index',
  generator: 'Next.js',
  alternates: {
    canonical: metadataItems.pathname,
  },

  // todo: add og:image when logo is released
  // icons: {
  //   icon: [
  //     {
  //       url: '/favicon/android-chrome-192x192.png',
  //       sizes: '192x192',
  //       type: 'image/png',
  //     },
  //     {
  //       url: '/favicon/favicon-32x32.png',
  //       sizes: '32x32',
  //       type: 'image/png',
  //     },
  //     {
  //       url: '/favicon/favicon-16x16.png',
  //       sizes: '16x16',
  //       type: 'image/png',
  //     },
  //   ],
  //   apple: {
  //     url: '/favicon/apple-touch-icon.png',
  //     sizes: '180x180',
  //     type: 'image/png',
  //   },
  // },
}
