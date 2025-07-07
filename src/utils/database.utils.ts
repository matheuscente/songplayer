import Database from "better-sqlite3";
export class DbManager {
  private createTable(
    database: Database.Database,
    tableName: string,
    settings: string
  ): { success: true } | { success: false; error: Error } {
    try {
      database
        .prepare(
          `
                CREATE TABLE IF NOT EXISTS ${tableName} (
                ${settings}
            )
                `
        )
        .run();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  createAllTables(
    database: Database.Database
  ): { success: true } | { success: false; error: Error } {
    try {
      const vehicle = this.createTable(
        database,
        "vehicles",
        `   
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plate TEXT UNIQUE NOT NULL,
                brand TEXT NOT NULL,
                model TEXT NOT NULL,
                manufacture_year INT NOT NULL`
      );

      const car = this.createTable(
        database,
        "cars",
        `
         id INTEGER PRIMARY KEY,
        doors_number INTEGER NOT NULL,
        fuel_type TEXT NOT NULL,
        CONSTRAINT fk_car_vehicle FOREIGN KEY (id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE`
      );

      const bus = this.createTable(
        database,
        "buses",
        `
         id INTEGER PRIMARY KEY,
        seats_number INTEGER NOT NULL,
        has_bathroom BOOLEAN NOT NULL,
        CONSTRAINT fk_bus_vehicle FOREIGN KEY (id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE`
      );

      const moto = this.createTable(
        database,
        "motos",
        `  
         id INTEGER PRIMARY KEY,
        displacements INTEGER NOT NULL,
        start_type TEXT NOT NULL,
        CONSTRAINT fk_moto_vehicle FOREIGN KEY (id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE`
      );

      if ("error" in vehicle) {
        return vehicle;
      } else if ("error" in bus) {
        return bus;
      } else if ("error" in moto) {
        return moto;
      } else if ("error" in car) {
        return car;
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  testDatabase(database: Database.Database) {
    const allTables = database
      .prepare("SELECT name FROM sqlite_master WHERE type='table';")
      .all();
    const acceptNames: string[] = [
      "vehicles",
      "buses",
      "motos",
      "cars",
      "sqlite_sequence",
    ];

    const hasErrors = allTables.filter(
      (table) => !acceptNames.includes((table as { name: string }).name)
    );
    if (hasErrors.length >= 1 || allTables.length < 5) {
      return { success: false, error: new Error("invalid table name") };
    }
    return { success: true };
  }
}
