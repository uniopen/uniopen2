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
            let timetable = pagecontent.find('.panel-body').find('.dl-horizontal').first().text();
            //console.log("\n### Orari: " + normalizeTimetable(timetable.replace(/: *\n */g, " ")));//.replace(":\n ", ""))
            
            timetable = normalizeTimetable(timetable.replace(/:[ \n]*/g, " ")).split("\n");

            //console.log("\n\n### ORARI ###")
            //let test = [] creo un array da zero per assicurarmi che non sia "sporco"
            for(let x = 0; x<timetable.length; x+=1){
                timetable[x] = timetable[x].trim()
                //test[x] = timetable[x]  anche creare un array completamente nuovo non funziona
                //console.log(timetable[x])
            }

            //console.log("Dimensione array = " + timetable.length + "\n\n")
            //console.log("\n### ORARI ###\n" + test);

            commitData(args.uni, args.type, args.code, args.url, args.key, { indirizzo: address, orari: timetable});    //Anche passando test non va

        }).catch((err) => {

            console.error(err.message, err.stack);

            commitData(args.uni, args.type, args.code, args.url, args.key, {});

        });
});
