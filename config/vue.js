exports.options = {
    rootPath: './views',
    layout: {
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        },
        template: {
            start: '<div id="app">',
            end: '</div>'
        }
    },
    vue: {
        head: {
            meta: [
                {
                  script: "./js/vue.min.js"
                },
                {
                  script: "./js/jquery.min.js"
                },
                {
                  script: "https://www.google.com/recaptcha/api.js"
                }
            ]
        }
    }
};
