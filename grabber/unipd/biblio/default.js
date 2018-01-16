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

            // titolo : #parent-fieldname-title
            // indirizzo : #parent-fieldname-indirizzo
            // posti : #parent-fieldname-posti_sedere
            // orari : #parent-fieldname-orari

            let pagecontent = $('#content');
            let address = pagecontent.find('#parent-fieldname-indirizzo').text().trim();
            let posti = Number(pagecontent.find('#parent-fieldname-posti_sedere').text());
            //return a human-readable string like "lun-ven: 9.00-24.00"
            let exttimetable = pagecontent.find('#parent-fieldname-orari p a').attr('href');
            let data = { indirizzo: address };
            if(posti) data.posti = posti;
            let nome = lodash.kebabCase(sanitize(pagecontent.find('#parent-fieldname-title').text()));

            if(exttimetable && args.raw){
              let grabberCode = nome;
              partialData(args.uni, args.type, args.code, args.url, args.key,  data);
              callGrabber(args.uni, args.type, 'orari/'+grabberCode, exttimetable, args.key);
            }else {
              commitData(args.uni, args.type, args.code, args.url, args.key, data);
            }
        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
