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
        console.log(res);
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
        <div>Loading...</div>
      ) : (
        <>
          <Box width={'80%'} mx="auto" pt={10}>
            <Card.Root>
              <Card.Header>
                <Card.Title data-testid="card-title">{user?.name}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Box as="dl">
                  <Text as="dt">自己紹介</Text>
                  <Text
                    as="dd"
                    dangerouslySetInnerHTML={{
                      __html: user?.description || '',
                    }}
                  ></Text>
                </Box>
                <Box as="dl" mt={4}>
                  <Text as="dt">好きな技術</Text>
                  <Text as="dd">{user?.user_skill?.map((skill) => skill?.skills?.name).join(', ')}</Text>
                </Box>
                <Flex gap={4} mt={4} justify="space-around">
                  <Text>
                    <Link href={user?.github_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuGithub size="30" />
                    </Link>
                  </Text>
                  <Text>
                    <Link href={user?.qiita_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuNotebook size="30" />
                    </Link>
                  </Text>
                  <Text>
                    <Link href={user?.x_id || '#'} target="_blank" background="black" color="white" p={1}>
                      <LuX size="30" />
                    </Link>
                  </Text>
                </Flex>
              </Card.Body>
              <Card.Footer />
            </Card.Root>
          </Box>
          <Box textAlign="center">
            <Link as="a" href="/" mt={4} colorScheme="blue">
              戻る
            </Link>
          </Box>
        </>
      )}
    </>
  );
};
