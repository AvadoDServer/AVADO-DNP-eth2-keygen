const configs = {
    development: {
        name: "dev",
        admin: true,
        api: {
            HTTP: "http://eth2keygen.my.ava.do:82",
        }
    },

    production: {
        name: "prod",
        admin: true,
        api: {
            HTTP: "http://eth2keygen.my.ava.do:82",
        }
    }
};
let config = process.env.REACT_APP_STAGE
    ? configs[process.env.REACT_APP_STAGE]
    : configs.development;

export default config;
