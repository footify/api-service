module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
        {
            name      : "footify-api-service",
            script    : "./index.js",
            watch: ['app'],
            ignore_watch: ['data', 'log'],
            watch_options: {
                usePolling: true,
                // interval: 300,
                // useFsEvents: true // override usePolling for osx
            }
        }
    ]
};
