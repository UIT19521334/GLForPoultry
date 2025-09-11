const {
    override,
    useBabelRc
} = require("customize-cra");

const ignoreSourceMapWarnings = () => (config) => {
    config.ignoreWarnings = [
        {
            module: /node_modules\/next\/dist/,
        },
    ];
    return config;
};

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    ignoreSourceMapWarnings()
);