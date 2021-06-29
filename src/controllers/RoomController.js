const Database = require("../db/config");

module.exports = {
    async create (req,res) {
        const db = await Database();
        const pass = req.body.password;
        let roomId = "";
        let ifExist;

        do {
            for(let i = 0; i < 6; i++) {
                roomId += Math.floor(Math.random() * 10).toString();
            }
    
            const roomsDb =  await db.all(`SELECT id FROM rooms`);
            ifExist = roomsDb.some(id => roomId === id);
        } while(ifExist);

        await db.run(`INSERT INTO rooms (
            id,
            pass
        ) VAlUES (
            ${parseInt(roomId)},
            "${pass}"
        )`);

        await db.close();

        res.redirect(`/room/${roomId}`);
    },
    async open (req,res ) {
        const db = await Database();
        const roomId = req.params.room;

        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and isRead = 0`);
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and isRead = 1`);

        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead});
    },
    async enter (req, res) {
        const db = await Database();
        const roomId = req.body.roomId;

        if (!roomId) {
            res.render('passincorrect', {url: `/`, title: 'O código digitado é invalido.', subtitle: 'Volte para o início e tente novamente'});
        }


        const searchRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`);

        if(searchRoom) {
            res.redirect(`/room/${roomId}`);
        } 
        
        res.render('passincorrect', {url: `/`, title: 'O código digitado é invalido.', subtitle: 'Volte para o início e tente novamente'});
        
    }

}