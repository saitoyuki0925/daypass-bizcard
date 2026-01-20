import { Box, Button, Card, Field, Input, Link, Text } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type HomeFormInput = {
  userId: string;
};

export const Home = () => {
  const navigate = useNavigate(); // ナビゲート用フック
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<HomeFormInput>();

  // フォーム送信時の処理
  const onSubmit = async (data: HomeFormInput) => {
    // 送信前にサーバーエラー表示をクリア
    clearErrors('root');

    try {
      navigate(`/cards/${data.userId}`);
    } catch (error) {
      // サーバーエラーが発生した場合、フォームのルートにエラーメッセージを設定
      setError('root', { type: 'server', message: 'サーバーエラーが発生しました。再度お試しください。' });
    }
  };

  return (
    <>
      <Box as="form" p={4} width={'90%'} mx="auto" pt={10} onSubmit={handleSubmit(onSubmit)}>
        <Card.Root>
          <Card.Header>
            <Card.Title data-testid="home-title">デジタル名刺アプリ</Card.Title>
          </Card.Header>
          <Card.Body>
            <Field.Root>
              <Field.Label htmlFor="userId">ID</Field.Label>
              <Input
                id="userId"
                {...register('userId', {
                  // idは英語文字列だけ入力できるようにバリデーションを追加
                  required: 'ユーザーIDは必須です',
                })}
                placeholder="ユーザーIDを入力してください"
                data-testid="home-userId"
              />
            </Field.Root>
            {errors.userId && (
              <Text role="alert" aria-live="polite" data-testid="home-error-userId" style={{ color: 'red' }} textStyle="sm">
                {errors.userId.message}
              </Text>
            )}

            <Button mt={4} colorScheme="blue" type="submit" data-testid="home-submit-button">
              名刺を検索
            </Button>
          </Card.Body>
        </Card.Root>
        <Box textAlign="center">
          <Link href="/cards/register" data-testid="home-register-button">
            新規登録
          </Link>
        </Box>
      </Box>
    </>
  );
};
