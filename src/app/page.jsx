import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
    <Head>  <link href="/dist/output.css" rel="stylesheet"></link><title>Our Test Page</title></Head>
    <p className='text-blue-500'>Testing Home Page</p>
    </>
  )
}
