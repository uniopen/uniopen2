(function (args) {

    console.log('default - grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('default - grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        console.log('default - grabber - source >>>');

        let $ = parseHtml(source);

        let sections = $('div.contenutoSezioneHtml table');

        sections.each((index, section) => {
            $(section).find('tr').each((index, row) => {
                let nomeEl = $(row).find('td').get(0);
                let indirizzoEl = $(row).find('td').get(1);

                let href = $(nomeEl).find('a').attr('href');
                let nome = sanitize($(nomeEl).text());
                let indirizzo = sanitize($(indirizzoEl).text());
                let grabberCode = lodash.kebabCase(nome);
                let key = rawkey(args.uni, args.type, nome);

                partialData(args.uni, args.type, args.code, href, key, { nome, indirizzo });

                callGrabber(args.uni, args.type, grabberCode, href, key);
            });
        });

    }).catch((err) => {

        console.error(err.message, err.stack);

    });
});
