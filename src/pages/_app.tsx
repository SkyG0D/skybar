import Head from 'next/head';
import { AppProps } from 'next/app';
import { StompSessionProvider } from 'react-stomp-hooks';
import { StompSessionProviderProps } from 'react-stomp-hooks/dist/interfaces/StompSessionProviderProps';
import { parseCookies } from 'nookies';
import { Fragment } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import NextNProgress from 'nextjs-progressbar';

import { AuthProvider } from '$contexts/AuthContext';
import { baseURL } from '$services/httpClient';
import { queryClient } from '$services/queryClient';
import { theme } from '$styles/theme';
import { OrdersProvider } from '$contexts/OrdersContext';
import Router from 'next/router';
import { useUIStore } from '$stores/ui';

const SOCKET_URL = `${baseURL}/sky-drinks`;

function App({ Component, pageProps }: AppProps) {
  const { 'skybar.token': token } = parseCookies();
  const { closeSidebar } = useUIStore(({ closeSidebar }) => ({ closeSidebar }));

  const isAuthenticated = Boolean(token);

  const Wrapper = isAuthenticated ? StompSessionProvider : Fragment;

  const options = {
    ...(isAuthenticated
      ? {
          connectHeaders: { Authorization: token },
          url: SOCKET_URL,
        }
      : {}),
  } as StompSessionProviderProps;

  Router.events.on('routeChangeComplete', closeSidebar);

  return (
    <Wrapper {...options}>
      <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <OrdersProvider>
              <Head>
                <title>Next Boilerplate</title>
              </Head>

              <NextNProgress
                color="#9A0680"
                startPosition={0.3}
                stopDelayMs={200}
                height={4}
              />

              <Component {...pageProps} />
            </OrdersProvider>
          </AuthProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </Wrapper>
  );
}

export default App;
