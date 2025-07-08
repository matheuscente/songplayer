import Database from "better-sqlite3";
import { DbManager } from "./repositories/database/database.utils";

const database = new Database('teste.db')
database.pragma('journal_mode = WAL')
database.pragma('foreign_keys = ON')

 const dbManager = new DbManager()
 dbManager.createAllTables(database)


 export default database
