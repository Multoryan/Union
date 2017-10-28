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
                   name :"viewport",
                   content: "width=device-width, initial-scale=1.0, maximum-scale=1.0"
                },
                {
                    style: "./css/semantic.min.css"
                },
                {
                  script: "./js/vue.min.js"
                },
                {
                  script: "https://www.google.com/recaptcha/api.js?render=explicit",
                  async: 'async'
                },
                {
                  script: "./js/jquery.min.js"
                },
                {
                  script: "./js/semantic.min.js"
                }
            ]
        }
    }
};
