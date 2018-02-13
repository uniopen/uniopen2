(function (args) {

    console.log('default - grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('default - grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        console.log('default - grabber - source >>>');

        let $ = parseHtml(source);

        let timeSanitize = (o) => {
          return o.replace(/da /g,"")
          .replace(/\ba\b/g,"-")
          .replace(/dalle ore/gi,"")
          .replace(/alle ore/gi,"-")
          .replace(/dalle/gi,"")
          .replace(/alle/gi,"-")
          .replace(/all'/gi,"- ")
          .replace(/di notte/gi,"");
        }

        /* TODO:
        * - fix area agripoli e vicenza in quanto aule unite e divise in li stesso livello padre
        * - improve parsing, think a better way to do it
        */
        
        let sections = $('div.accordion-head.accordion-a.clearfix p.hidden-content');
        let ts = '';
        sections.each((index, section) => {

            $(section).find('a').remove();
            $(section).find('br').replaceWith('$');

            let testo = $(section).text().split('$');

            let nome = null, posti = null,
                indirizzo = null, orario = null;

            nome = testo.shift();

            testo.forEach((item, index)=>{
              switch (true) {
                case (/Posti/.test(item)):
                  posti = item.match(/\d+/)[0];
                  break;
                case (/Indirizzo:/.test(item)):
                  indirizzo = item.match(/Indirizzo:\s*(.*)(?:\s*-\s*)/)[1];
                  break;
                case (/Orario di apertura:/.test(item)):
                  orari = timeSanitize(item.match(/Orario di apertura:(.*)/)[1]);
                  orari = orari.split(';');
                  orari.forEach((item, index) => {
                    orari[index] = normalizeTimetable(item);
                  });
                  break;
                default:

              }
            });
            if(nome != null && indirizzo != null ) {
              let key = rawkey(args.uni, args.type, nome);
              commitData(args.uni, args.type, args.code, args.url, key, { nome: nome, indirizzo: indirizzo, posti: posti, orari: orari});
            }


        });
    }).catch((err) => {

        console.error(err.message, err.stack);

    });
});
