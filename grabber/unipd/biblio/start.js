(function (args) {

    console.log('default - grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('default - grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        console.log('default - grabber - source >>>');

        let $ = parseHtml(source);

        let sections = $('div#parent-fieldname-text ul');

        sections.each((index, section) => {
            // console.log('-----'+index+'-----');
            let parsingOrarioDone = index == 0 ? true : false;
            $(section).find('li').each((index, el) => {

                let nomeEl = $(el).find('a');

                let href = $(nomeEl).attr('href');
                let nome = sanitize($(nomeEl).text());
                //let grabberCode = lodash.kebabCase(nome);
                let grabberCode = "default";
                let key = rawkey(args.uni, args.type, nome);
                // console.log(index + nome + href);
                partialData(args.uni, args.type, args.code, href, key, { nome });

                callGrabber(args.uni, args.type, grabberCode, href, key, parsingOrarioDone);
            });
        });

    }).catch((err) => {

        console.error(err.message, err.stack);

    });
});
