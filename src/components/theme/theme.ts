import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  // 要素セレクタへのグローバルCSSはここ
  globalCss: {
    // 'html, body': {
    //   bg: 'gray.100', // = background
    //   color: 'gray.800',
    // },
    dt: {
      fontWeight: 'bold',
    },
  },
});

export const theme = createSystem(defaultConfig, config);
