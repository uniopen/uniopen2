(function (args) {

    console.log('default - grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('default - grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        console.log('default - grabber - source >>>');

        let $ = parseHtml(source);

        let sections = $('div.accordion-head.accordion-a.clearfix p');

        sections.each((index, section) => {

          let nome = $(section).find('strong').remove().text();
          $(section).find('br').replaceWith(';');

          let testo = $(section).text()
            .replace(/\(Posti[\sA-Za-z.]*(\d+)\).*Indirizzo: (.*)Tel.*:(.*)/, "$1;$2;$3")
            .replace(/da /g,"")
            .replace(/\ba\b/g,"-")
            .replace(/dalle ore/gi,"")
            .replace(/alle ore/gi,"-")
            .replace(/di notte/gi,"");

          let key = rawkey(args.uni, args.type, nome);
          let el = testo.split(";");
          let posti = el.shift();
          let address = el.shift();

          el.forEach((item,index)=>{
            el[index] = normalizeTimetable(item);
          });

          commitData(args.uni, args.type, args.code, args.url, key, { nome: nome, indirizzo: address, posti: posti, orari: el});

        });

    }).catch((err) => {

        console.error(err.message, err.stack);

    });
});
