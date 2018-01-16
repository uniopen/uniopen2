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

            let timetable = pagecontent.find('div.portlet-static-orari-jappelli table tbody tr').slice(4,6);
            let tmp = [];
            timetable.each((index,el)=>{
              let td = $(el).find('td').slice(1,3);
              tmp.push(
                normalizeTimetable($(td).first().text() + ' ' + $(td).last().text(),1)
              )
            });
            commitData(args.uni, args.type, args.code, args.url, args.key, { orari: tmp });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
