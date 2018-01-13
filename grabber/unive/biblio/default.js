//http://www.unive.it/pag/4750/

(function (args) {

    console.log('default - grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('default - grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        console.log('default - grabber - source >>>');

        let $ = parseHtml(source);

        //this element contains a list of <a> with libraries link
        let sections = $('#page_content').find('.list-group').find('a');

        sections.each((index, section) => {
            //index 0, 5 and 7 (length-1) are not libraries -> ok
            //index 1 is a group of libraries, harder to parse
            if(index==0 || index==1 || index==5 || index==sections.length-1){
                console.log('pagine non utili')
            } else {
                //let nome = sanitize(section.title); //the name of the library
                let nome = sanitize(section.attribs.title);
                let href = "http://www.unive.it" + section.attribs.href;    //maybe we should add "www.unive.it" in front of this url
                //let grabberCode = lodash.kebabCase(nome);
                let key = rawkey(args.uni, args.type, nome);

                //by default we call generic details grabber, but some libraries may require a specific one
                let grabberCode = 'default-details-grabber';
                if( nome.toLowerCase().includes('cfz') )
                    grabberCode = 'cfz-servizi-bibliotecari';

                //console.log("\n\n" + nome + "\n\n");
                console.log("--------------------- grabberCode =" + grabberCode + " -----------------------")

                partialData(args.uni, args.type, args.code, href, key, {nome});

                callGrabber(args.uni, args.type, grabberCode, href, key);
            }
        });
    }).catch((err) => {
        console.error(err.message, err.stack);
    });
});
