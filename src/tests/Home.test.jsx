import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
// import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../components/theme/theme.ts';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// この import はモック定義の後でOK
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { Home } from '../components/page/Home';
import userEvent from '@testing-library/user-event';

// ページのレンダリング
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <ChakraProvider value={theme}>
              <Home />
            </ChakraProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('Home Test', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // モックの初期化
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('タイトルが表示されている', async () => {
    renderPage();

    const homeTitle = await screen.findByTestId('home-title');
    expect(homeTitle).toHaveTextContent('デジタル名刺アプリ');
  });

  test('IDを入力してボタンを押すと/cards/:idに遷移する(useNavigateのパスをみる)', async () => {
    const user = userEvent.setup();
    renderPage();

    const inputUserId = await screen.findByTestId('home-userId');
    fireEvent.change(inputUserId, { target: { value: 'testId' } });

    const submitButton = await screen.findByTestId('home-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cards/testId');
    });
  });

  test('IDを入力しないでボタンを押すとエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    renderPage();

    const submitButton = await screen.findByTestId('home-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('home-error-userId')).toHaveTextContent('ユーザーIDは必須です');
    });
  });

  test('新規登録はこちらを押すと/cards/registerに遷移する', async () => {
    renderPage();
    const backButton = await screen.findByTestId('home-register-button');
    expect(backButton).toHaveAttribute('href', '/cards/register');
  });
});
