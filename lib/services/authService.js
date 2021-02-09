class authServcie {
    constructor(db) {
        this._db = db;
    }
    
    async login(username, password) {
        const user = await this._db.getUserByName(username);
        if (!user) throw new Error('User not found');
        if (!user.validPassword(password, user)) throw new Error('Password is wrong');

        return user.generateJWT();
    }
    
    async registration(username, password) {
        const test = await this._db.getUserByName(username);
        if (test) throw new Error('Username already taken');

        await this._db.createUser(username, password);
    }
}

module.exports = authServcie;