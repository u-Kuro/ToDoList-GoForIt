import Head from "next/head"
import Script from 'next/script'
import '../static/styles/style.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta content="IE=edge" />
        <meta name="viewport" content="width=device-width" />
        <Script href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
