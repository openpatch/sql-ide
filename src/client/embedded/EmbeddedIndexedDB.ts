import Dexie from 'dexie';

declare global {
    interface Window {
        store: {
            sqlideScripts: Dexie.Table;
            sqlideDatabases: Dexie.Table;
        };
    }
}

export class EmbeddedIndexedDB {
    private scriptsTable: Dexie.Table;
    private databasesTable: Dexie.Table;

    constructor(private databaseIdentifier: string) {
    }

    public open(successCallback: () => void) {
        try {
            // Access the existing Dexie tables
            this.scriptsTable = window.store.sqlideScripts;
            this.databasesTable = window.store.sqlideDatabases;
            
            // Verify the tables are available and ready
            if (this.scriptsTable && this.databasesTable) {
                // Dexie tables are already initialized, just call the callback
                successCallback();
            } else {
                console.log("Dexie tables not available at window.store");
            }
        } catch (error) {
            console.log("Couldn't access Dexie tables: " + error);
        }
    }

    public writeScript(scriptId: string, script: string) {
        this.scriptsTable.put({
            scriptId: scriptId,
            script: script
        }).catch(error => {
            console.error("Error writing script: ", error);
        });
    }

    public removeScript(scriptId: string) {
        this.scriptsTable.delete(scriptId).catch(error => {
            console.error("Error removing script: ", error);
        });
    }

    public getScript(scriptId: string, callback: (script: string) => void) {
        this.scriptsTable.get(scriptId)
            .then(result => {
                if (result == null) {
                    callback(null);
                } else {
                    callback(result.script);
                }
            })
            .catch(error => {
                console.error("Error getting script: ", error);
                callback(null);
            });
    }

    public writeDatabase(databaseID: string, database: string) {
        this.databasesTable.put({
            databaseId: databaseID,
            database: database
        }).catch(error => {
            console.error("Error writing database: ", error);
        });
    }

    public removeDatabase(databaseId: string) {
        this.databasesTable.delete(databaseId).catch(error => {
            console.error("Error removing database: ", error);
        });
    }

    public getDatabase(databaseId: string, callback: (database: string) => void) {
        this.databasesTable.get(databaseId)
            .then(result => {
                if (result == null) {
                    callback(null);
                } else {
                    callback(result.database);
                }
            })
            .catch(error => {
                console.error("Error getting database: ", error);
                callback(null);
            });
    }
}
