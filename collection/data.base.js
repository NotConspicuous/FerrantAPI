const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

init = async () => {
    let db = await open({
        filename: './database.db',
        driver: sqlite3.cached.Database
    })
    await db.run('CREATE TABLE IF NOT EXISTS files (id TEXT, file_identity TEXT, virtual_path TEXT)')
}

init()