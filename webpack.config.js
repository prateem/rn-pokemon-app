const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// https://github.com/software-mansion/react-native-reanimated/issues/2994
module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(
        {
            ...env,
            babel: {
                dangerouslyAddModulePathsToTranspile: [
                    '@gorhom/bottom-sheet',
                ],
            }
        },
        argv
    );
    return config;
};