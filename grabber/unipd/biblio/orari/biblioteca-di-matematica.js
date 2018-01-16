(function (args) {

    console.log('grabber - args >>>', args);

    return httpGet(args.url)
        .then((res) => {
            console.log('grabber - httpGet >>>');
            return res.text();
        })
        .then((source) => {
            console.log('grabber - parsing >>>')
            let $ = parseHtml(source);

            let pagecontent = $('#content');

            let timetable = pagecontent.find('div#portletwrapper-436f6e74656e7457656c6c506f72746c6574732e42656c6f775469746c65506f72746c65744d616e61676572320a636f6e746578740a2f7375706572706c6f6e652f6269626c696f746563612d64692d6d6174656d61746963612f6c612d6269626c696f746563610a6f726172696f');
            let tmp = [];
            tmp.push(normalizeTimetable($(timetable).find('dd p').first().text()));

            commitData(args.uni, args.type, args.code, args.url, args.key, { orari: tmp });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
