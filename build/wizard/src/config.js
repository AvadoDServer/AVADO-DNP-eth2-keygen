const configs = {
    development: {
        name: "dev",
        admin: true,
        api: {
            HTTP: "http://my.eth2keygen.avado.dnp.dappnode.eth:82",
        }
    },

    production: {
        name: "prod",
        admin: true,
        api: {
            HTTP: "http://my.eth2keygen.avado.dnp.dappnode.eth:82",
        }
    }
};
let config = process.env.REACT_APP_STAGE
    ? configs[process.env.REACT_APP_STAGE]
    : configs.development;

export default config;
