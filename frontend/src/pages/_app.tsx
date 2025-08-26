import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { ConditionalCartProvider } from '@/context/ConditionalCartProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <AuthProvider>
        <ConditionalCartProvider>
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ConditionalCartProvider>
      </AuthProvider>
    </div>
  )
}
