//http://www.unive.it/pag/4756/

(function (args) {

    console.log('grabber - args >>>', args);

    return httpGet(args.url)
        .then((res) => {
            console.log('grabber - httpGet >>>');
            return res.text();
        })
        .then((source) => {
            console.log('grabber - parsing CFZ >>>')
            let $ = parseHtml(source);

            let pagecontent = $('#page_content');

            let address = pagecontent.find('h4').first().text(); //how to exclude inner tag?

            //return a human-readable string like "lun-ven: 9.00-24.00"
            let timetable = pagecontent.find('.panel-body').find('.col-md-4').first().find('p')[1].innerText;  //TODO NOT WORKING


            //console.log("---- CFZ ---- " + JSON.stringify(temp_timetable[1]))


            commitData(args.uni, args.type, args.code, args.url, args.key, { indirizzo: address, orari: timetable });

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
