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
            ${pass}
        )`);

        await db.close();

        res.redirect(`/room/${roomId}`);
    }
}