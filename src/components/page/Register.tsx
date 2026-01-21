import { getSkills, insertUser, insertUserSkills } from '../../utils/supabaseFunctions/supabaseFunctions';
import { Box, Button, Card, createListCollection, Field, Heading, Input, Portal, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

/*****
 *
 * 型定義
 *
 ****/

type skillOption = { value: string; label: string };

type SkillsOptions = {
  value: string;
  label: string;
};

// ユーザーフォームの入力データの型
type UserFormInput = {
  userId: string;
  name: string;
  description: string;
  skills: string[];
  githubId: string;
  qiitaId: string;
  xId: string;
};

type Skills = {
  id: number;
  name: string | null;
  created_at: string;
};

export const Register = memo(() => {
  const [skills, setSkills] = useState<Skills[]>([]); // skills情報格納state
  const navigate = useNavigate(); // ナビゲート用フック

  // skills state から options を生成
  const skillsOptions = useMemo(() => {
    return createListCollection({
      items: skills.map((skill) => ({
        value: String(skill.id),
        label: skill.name ?? '',
      })),
    });
  }, [skills]);

  // 登録ボタンクリックハンドラ
  const onSubmitRegistration = useCallback(async (user: UserFormInput) => {
    const { userId, name, description, githubId, qiitaId, xId, skills } = user;

    // userSkillsテーブルにスキル情報を追加する。skillsは配列なのでmapで変換。複数行登録に対応するためにinsertUserSkillsを使用
    const userSkills = skills.map((skillId) => ({
      user_id: userId,
      skill_id: Number(skillId), // skillOptionのvalueはstringなのでnumberに変換
    }));

    await insertUser({
      user_id: userId,
      name: name,
      description: description,
      github_id: githubId,
      qiita_id: qiitaId,
      x_id: xId,
      created_at: new Date().toISOString(),
    });

    console.log(userSkills);
    await insertUserSkills(userSkills);
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UserFormInput>({
    defaultValues: {
      skills: [], // multiple の場合は空配列スタートが安全
    },
  });

  const onSubmit = async (data: UserFormInput) => {
    // 送信前にサーバーエラー表示をクリア
    clearErrors('root');

    const user = {
      userId: data.userId,
      name: data.name,
      description: data.description,
      skills: data.skills,
      githubId: data.githubId,
      qiitaId: data.qiitaId,
      xId: data.xId,
    };

    try {
      await onSubmitRegistration(user);
    } catch (error) {
      // サーバーエラーが発生した場合、フォームのルートにエラーメッセージを設定
      setError('root', { type: 'server', message: 'サーバーエラーが発生しました。再度お試しください。' });
    }
  };

  // 初回マウント時に一度だけ取得
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await getSkills();
      if (!cancelled) setSkills(res.data ?? []);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 登録成功時にホームへ遷移
  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate('/');
    }
  }, [isSubmitSuccessful]);

  return (
    <Box p={2} width={'90%'} mx="auto" pt={10}>
      <Heading textAlign="center">新規名刺登録</Heading>

      <Box as={'form'} onSubmit={handleSubmit(onSubmit)} mt={5}>
        <Card.Root>
          <Card.Header>
            <Card.Title data-testid="register-title">登録情報を入力してください。</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack spaceY={4}>
              <Field.Root>
                <Field.Label htmlFor="userId">ユーザーID</Field.Label>
                <Input
                  data-testid="register-userId"
                  id="userId"
                  {...register('userId', {
                    // idは英語文字列だけ入力できるようにバリデーションを追加
                    required: 'ユーザーIDは必須です',
                    pattern: {
                      value: /^[a-zA-Z_]+$/,
                      message: 'ユーザーIDは英語文字列とアンダースコア(_)のみ使用できます',
                    },
                  })}
                />
                {errors.userId && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-userId" style={{ color: 'red' }} textStyle="sm">
                    {errors.userId.message}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label htmlFor="name">お名前</Field.Label>
                <Input data-testid="register-name" id="name" {...register('name', { required: 'お名前は必須です' })} />
                {errors.name && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-name" style={{ color: 'red' }} textStyle="sm">
                    {errors.name.message}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label htmlFor="description">自己紹介</Field.Label>
                <Textarea id="description" data-testid="register-description" {...register('description', { required: '自己紹介は必須です' })} />
                {errors.description && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-description" style={{ color: 'red' }} textStyle="sm">
                    {errors.description.message}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Select.Root collection={skillsOptions} multiple={true} {...register('skills', { required: 'スキルは必須です' })}>
                  <Select.HiddenSelect data-testid="register-select" />
                  <Select.Label htmlFor="skills">スキル</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select option" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {skillsOptions.items.map((skill: SkillsOptions) => (
                          <Select.Item item={skill} key={skill.value}>
                            {skill.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
                {errors.skills && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-select" style={{ color: 'red' }} textStyle="sm">
                    {errors.skills.message}
                  </Text>
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label htmlFor="githubId">GitHub ID</Field.Label>
                <Input data-testid="register-githubId" id="githubId" {...register('githubId', { required: 'GitHub IDは必須です' })} />
                {errors.githubId && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-githubId" style={{ color: 'red' }} textStyle="sm">
                    {errors.githubId.message}
                  </Text>
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label htmlFor="qiitaId">Qiita ID</Field.Label>
                <Input data-testid="register-qiitaId" id="qiitaId" {...register('qiitaId', { required: 'Qiita IDは必須です' })} />
                {errors.qiitaId && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-qiitaId" style={{ color: 'red' }} textStyle="sm">
                    {errors.qiitaId.message}
                  </Text>
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label htmlFor="xId">X ID</Field.Label>
                <Input data-testid="register-xId" id="xId" {...register('xId', { required: 'X IDは必須です' })} />
                {errors.xId && (
                  <Text role="alert" aria-live="polite" data-testid="register-error-xId" style={{ color: 'red' }} textStyle="sm">
                    {errors.xId.message}
                  </Text>
                )}
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" mt={4} colorScheme="blue" w={'100%'} data-testid="register-submit-button">
              登録
            </Button>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Box>
  );
});
