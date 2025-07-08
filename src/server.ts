import app from './app'
import database from './database'
import { DbManager } from './repositories/database/database.utils'

const dbManager = new DbManager()
const testDatabase = dbManager.testDatabase(database)

if('error' in testDatabase) {
 console.error("Erro ao inicializar o banco:", testDatabase.error);
  process.exit(1);   
}

app.listen(3000, () => {
    console.log('app running in 3000 port')
})
