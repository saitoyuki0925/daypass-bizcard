import '@testing-library/jest-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { CardPage } from '../components/page/CardPage';
import { Home } from '../components/page/Home';
import { vi } from 'vitest';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../components/theme/theme.ts';

//  vi.mock は import より先に評価される必要があるため、基本はファイル先頭で書く
vi.mock('../utils/supabaseFunctions/supabaseFunctions', () => ({
  getUserById: vi.fn(),
}));

// getUserById は、本物ではなく、上の jest.mock が作った 偽物の関数
import { getUserById } from '../utils/supabaseFunctions/supabaseFunctions';
import userEvent from '@testing-library/user-event';

const mockedGetUserById = vi.mocked(getUserById);

// ページのレンダリング
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/card/testUser']}>
      <Routes>
        <Route
          path="/card/:id"
          element={
            <ChakraProvider value={theme}>
              <CardPage />
            </ChakraProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('CardPage Test', () => {
  beforeEach(() => {
    mockedGetUserById.mockResolvedValue({
      data: {
        user_id: 'testUser',
        name: 'テストユーザー',
        description: '<p>これはテスト用の自己紹介です</p>',
        user_skill: [{ skills: { name: 'React' } }, { skills: { name: 'TypeScript' } }],
        github_id: 'https://github.com/',
        qiita_id: 'https://qiita.com/',
        x_id: 'https://x.com/',
        created_at: '2025-01-01 12:00:00',
      },
      error: null,
    });
  });

  // モックの初期化
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('名前が表示されている', async () => {
    renderPage();
    // 非同期で表示されるので findBy で待つ
    const cardName = await screen.findByTestId('card-name');
    expect(cardName).toHaveTextContent('テストユーザー');
  });

  test('自己紹介が表示されている', async () => {
    renderPage();
    const profile = await screen.findByTestId('card-profile');
    // 「HTMLとして <p> が入っている」こと自体を確認
    expect(profile).toContainHTML('<p>これはテスト用の自己紹介です</p>');
  });

  test(`技術が表示されている`, async () => {
    renderPage();
    const skills = await screen.findByTestId('card-skills');
    expect(skills).toHaveTextContent('React, TypeScript');
  });

  test(`Githubアイコンが表示されている`, async () => {
    renderPage();
    const githubIcon = await screen.findByTestId('github-icon');
    expect(githubIcon).toBeInTheDocument();
  });

  test(`Qiitaのアイコンが表示されている`, async () => {
    renderPage();
    const qiitaIcon = await screen.findByTestId('qiita-icon');
    expect(qiitaIcon).toBeInTheDocument();
  });

  test(`xのアイコンが表示されている`, async () => {
    renderPage();
    const xIcon = await screen.findByTestId('x-icon');
    expect(xIcon).toBeInTheDocument();
  });

  test(`戻るボタンをクリックすると/に遷移する`, async () => {
    renderPage();
    const backButton = await screen.findByTestId('card-back-button');
    userEvent.click(backButton);
  });

  test('戻るリンクの href が "/" である', async () => {
    renderPage();
    const backButton = await screen.findByTestId('card-back-button');
    expect(backButton).toHaveAttribute('href', '/');
  });
});
