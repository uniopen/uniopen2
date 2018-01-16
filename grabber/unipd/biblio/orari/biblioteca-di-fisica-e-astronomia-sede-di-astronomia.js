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

            let timetable = pagecontent.find('div.portlet-static-astro2 table tbody tr').slice(3);
            timetable = timetable.find('td').slice(1,3);
            timetable = [timetable.first().text()+' '+timetable.last().text()];

            commitData(args.uni, args.type, args.code, args.url, args.key, { orari: timetable });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
