import { render, screen } from '@testing-library/react';
import * as Chakra from '@chakra-ui/react';

import { Header } from '$components/ui/Header';
import { createUseAuth } from '$__mocks__/auth';

jest.mock('../../../../services/api/files', () => ({}));

jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('Header componenet', () => {
  it('renders correctly', () => {
    jest.spyOn(Chakra, 'useBreakpointValue').mockReturnValue(3);

    createUseAuth({
      isLoading: false,
      isAuthenticated: true,
      user: { role: 'USER', name: 'test-user' },
    });

    render(<Header />);

    expect(screen.getByRole('img', { name: /avatar/i })).toBeInTheDocument();
  });

  it('renders spinner when user is not authenticated and prop isLoading is true', () => {
    createUseAuth({
      isLoading: true,
      user: { role: 'USER' },
    });

    render(<Header />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders sign out button when user is not authenticated and prop isLoading is false', () => {
    createUseAuth({
      user: { role: 'USER' },
    });

    render(<Header />);

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renders menu button when screen is small', () => {
    jest.spyOn(Chakra, 'useBreakpointValue').mockReturnValueOnce(0);

    createUseAuth({
      user: { role: 'USER' },
    });

    render(<Header />);

    expect(
      screen.getByRole('button', { name: /abrir menu/i }),
    ).toBeInTheDocument();
  });
});
