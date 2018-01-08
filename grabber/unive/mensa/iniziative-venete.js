(function (args) {

    console.log('grabber - args >>>', args);

    return httpGet(args.url).then((res) => {

        console.log('grabber - httpGet >>>');

        return res.text();

    }).then((source) => {

        commitData(args.uni, args.type, args.code, args.url, args.key, { note: 'Iniziative Venete Note' });

        // let raw = { nome: args.raw.nome, indirizzo: args.raw.indirizzo, note: 'Iniziative Venete Note' };

        // return [{ uni: args.uni, type: args.type, key: args.key, raw }];

    }).catch((err) => {

        console.error(err.message, err.stack);

        commitData(args.uni, args.type, args.code, args.url, args.key, {});

    });
});
