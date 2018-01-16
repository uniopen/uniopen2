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

            let timetable = pagecontent.find('div.portlet-static-orari table tbody tr');
            let tmp = [];
            timetable.each((index, el)=>{
              tmp.push(normalizeTimetable($(el).find('td').first().text()+' '+$(el).find('td').last().text()));
            });

            commitData(args.uni, args.type, args.code, args.url, args.key, { orari: tmp });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
