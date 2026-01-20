import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { vi } from 'vitest';
// import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../components/theme/theme.ts';

//  vi.mock は import より先に評価される必要があるため、基本はファイル先頭で書く
vi.mock('../utils/supabaseFunctions/supabaseFunctions', () => ({
  getSkills: vi.fn(),
  insertUser: vi.fn(),
  insertUserSkills: vi.fn(),
}));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// getSkills, insertUser, insertUserSkills は、本物ではなく、上の jest.mock が作った 偽物の関数
import { getSkills, insertUser, insertUserSkills } from '../utils/supabaseFunctions/supabaseFunctions';
// この import はモック定義の後でOK
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import { Register } from '../components/page/Register';
import userEvent from '@testing-library/user-event';

const mockedGetSkills = vi.mocked(getSkills);

// ページのレンダリング
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/card/register']}>
      <Routes>
        <Route
          path="/card/register"
          element={
            <ChakraProvider value={theme}>
              <Register />
            </ChakraProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('Register Test', () => {
  beforeEach(() => {
    mockedGetSkills.mockResolvedValue({
      data: [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'React' },
        { id: 3, name: 'TypeScript' },
      ],
      error: null,
    });
    mockNavigate.mockClear();
  });

  // モックの初期化
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('タイトルが表示されている', async () => {
    renderPage();
    // 非同期で表示されるので findBy で待つ
    const registerTitle = await screen.findByTestId('register-title');
    expect(registerTitle).toHaveTextContent('登録情報を入力してください。');
  });

  test('全項目入力して登録ボタンを押すと/に遷移する', async () => {
    const user = userEvent.setup();
    renderPage();

    // 入力項目の獲得
    const inputUserId = await screen.findByTestId('register-userId');
    const inputUserName = await screen.findByTestId('register-name');
    const textAreaDescription = await screen.findByTestId('register-description');
    const selectSkills = await screen.findByTestId('register-select');
    const inputGithubId = await screen.findByTestId('register-githubId');
    const inputQiitaId = await screen.findByTestId('register-qiitaId');
    const inputXId = await screen.findByTestId('register-xId');
    const submitButton = await screen.findByTestId('register-submit-button');

    // 入力
    fireEvent.change(inputUserId, { target: { value: 'testId' } });
    fireEvent.change(inputUserName, { target: { value: 'テストユーザー' } });
    fireEvent.change(textAreaDescription, { target: { value: '<p>これはテスト用の自己紹介です</p>' } });
    await user.selectOptions(selectSkills, ['2', '3']); // option.value が "2"(React), "3"(TypeScript) のため
    fireEvent.change(inputGithubId, { target: { value: 'testGithub' } });
    fireEvent.change(inputQiitaId, { target: { value: 'testQiita' } });
    fireEvent.change(inputXId, { target: { value: 'testXId' } });
    // fireEvent.click(submitButton);

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  test('IDがないときにエラーメッセージがでる', async () => {
    const user = userEvent.setup();
    renderPage();

    const submitButton = await screen.findByTestId('register-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('register-error-userId')).toHaveTextContent('ユーザーIDは必須です');
    });
  });

  test('名前がないときにエラーメッセージがでる', async () => {
    const user = userEvent.setup();
    renderPage();

    const submitButton = await screen.findByTestId('register-submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('register-error-name')).toHaveTextContent('お名前は必須です');
    });
  });

  test('紹介分がないときにエラーメッセージがでる', async () => {
    const user = userEvent.setup();
    renderPage();
    const submitButton = await screen.findByTestId('register-submit-button');
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByTestId('register-error-description')).toHaveTextContent('自己紹介は必須です');
    });
  });

  test('スキル分がないときにエラーメッセージがでる', async () => {
    const user = userEvent.setup();
    renderPage();
    const submitButton = await screen.findByTestId('register-submit-button');
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByTestId('register-error-select')).toHaveTextContent('スキルは必須です');
    });
  });
});
