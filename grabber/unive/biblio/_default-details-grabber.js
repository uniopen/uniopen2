//http://www.unive.it/pag/4757/

(function (args) {

    console.log('grabber - args >>>', args);

    return httpGet(args.url)
        .then((res) => {
            console.log('grabber - httpGet >>>');
            return res.text();
        })
        .then((source) => {
            console.log('grabber - parsing ' + args.key + ' >>>')
            let $ = parseHtml(source);

            let pagecontent = $('#page_content');

            let address = pagecontent.find('.lead').text(); //how to exclude inner tag?

            //return a human-readable string like "lun-ven: 9.00-24.00"
            let timetable = normalizeTimetable(pagecontent.find('.panel-body').find('.dl-horizontal').first().text());

            commitData(args.uni, args.type, args.code, args.url, args.key, { indirizzo: address, orari: timetable });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
