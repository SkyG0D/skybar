import Head from 'next/head';
import { AppProps } from 'next/app';
import { StompSessionProvider } from 'react-stomp-hooks';
import { StompSessionProviderProps } from 'react-stomp-hooks/dist/interfaces/StompSessionProviderProps';
import { parseCookies } from 'nookies';
import { Fragment } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from '$contexts/AuthContext';
import { baseURL } from '$services/httpClient';
import { queryClient } from '$services/queryClient';
import { theme } from '$styles/theme';

const SOCKET_URL = `${baseURL}/sky-drinks`;

function App({ Component, pageProps }: AppProps) {
  const { 'skybar.token': token } = parseCookies();

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

  return (
    <Wrapper {...options}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Head>
              <title>Next Boilerplate</title>
            </Head>

            <Component {...pageProps} />
          </AuthProvider>

          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </Wrapper>
  );
}

export default App;
