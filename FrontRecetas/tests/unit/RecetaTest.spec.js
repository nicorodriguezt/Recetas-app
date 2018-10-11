import { Receta } from '../../src/resources/Receta'
const nock = require('nock');

describe('Testing Receta Resources', () => {

    const server = nock('http://localhost:3000/')
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' });

    it('Find', async () => {
        let params = {
            Nombre: "mata",
            Saltar: 0,
            Limite: 6
        };

        server.get("receta/verReceta/", {params})
            .replyWithFile(200, __dirname + '/replies/find.json' );

        let response = await Receta.find(params);

        expect(response).toBeDefined();
    });

    it('FindOne', async () => {
        server.get("receta/verReceta/1")
            .replyWithFile(200, __dirname + '/replies/findOnejson' );

        let response = await Receta.findOne(1);

        expect(response).toBeDefined();
    })

})