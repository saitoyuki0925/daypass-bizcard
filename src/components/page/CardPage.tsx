import { Box, Card, Flex, Link, Text } from '@chakra-ui/react';
import { getUserById } from '../../utils/supabaseFunctions/supabaseFunctions';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LuGithub, LuNotebook, LuX } from 'react-icons/lu';
import { UserClass } from '../../domain/users';

export const CardPage = () => {
  //パラメーター取得
  const { id } = useParams<{ id: string }>();
  //user情報格納
  const [user, setUser] = useState<UserClass | null>(null);

  //fetchUserByIdを実行
  useEffect(() => {
    if (id) {
      //userIdからユーザー情報を取得
      (async () => {
        const res = await getUserById(id || '');
        setUser(res.data ?? null); // 取得したデータをstateにセット
      })();
    }
  }, [id]);

  //ロード画面を作成
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <>
      {isLoading ? (
        <Text data-testid="card-loading">Loading...</Text>
      ) : (
        <>
          <Box width={'80%'} mx="auto" pt={10}>
            <Card.Root>
              <Card.Header>
                <Card.Title data-testid="card-name">{user?.name}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Box as="dl">
                  <Text as="dt">自己紹介</Text>
                  <Text
                    as="dd"
                    dangerouslySetInnerHTML={{
                      __html: user?.description || '',
                    }}
                    data-testid="card-profile"
                  ></Text>
                </Box>
                <Box as="dl" mt={4}>
                  <Text as="dt">好きな技術</Text>
                  <Text as="dd" data-testid="card-skills">
                    {user?.user_skill?.map((skill) => skill?.skills?.name).join(', ')}
                  </Text>
                </Box>
                <Flex gap={4} mt={4} justify="space-around">
                  <Text>
                    <Link href={user?.github_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuGithub size="30" data-testid="github-icon" />
                    </Link>
                  </Text>
                  <Text>
                    <Link href={user?.qiita_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuNotebook size="30" data-testid="qiita-icon" />
                    </Link>
                  </Text>
                  <Text>
                    <Link href={user?.x_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuX size="30" data-testid="x-icon" />
                    </Link>
                  </Text>
                </Flex>
              </Card.Body>
              <Card.Footer />
            </Card.Root>
          </Box>
          <Box textAlign="center">
            <Link as="a" href="/" mt={4} colorScheme="blue" data-testid="card-back-button">
              戻る
            </Link>
          </Box>
        </>
      )}
    </>
  );
};
