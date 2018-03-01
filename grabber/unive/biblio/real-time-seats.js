//http://www.unive.it/pag/4757/

(function (args) {

    console.log('grabber - args >>>', args);

    return httpGet(args.url)
        .then((res) => {
            console.log('grabber - httpGet >>>');
            return res.text();
        })
        .then((source) => {
            console.log('grabber - parsing ' + args.key + ' >>>\t real-time-seats')

            console.log("\n\n### keys ###\n" + args.key);

            let $ = parseHtml(source);

            let pagecontent = $('body');

            //console.log("\n\n### source ###\n" + pagecontent.text())
            let data = JSON.parse(pagecontent.text());
            //console.log("### CFZ = " + res.CFZ.persone)

            let res = "";
            for(var x in data){
                if(args.key.indexOf(x.toLowerCase()) != -1)
                    res = x;
            }

            //console.log("#### Per " + args.key + " è stato scelto " + res)

            let max = Number(data[res].max);
            let occupied = Number(data[res].persone);

            commitData(args.uni, args.type, args.code, args.url, args.key, {posti: max, posti_occupati: occupied});
        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
