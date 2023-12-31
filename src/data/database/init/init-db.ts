import {applyPolyfills, defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import {Capacitor} from '@capacitor/core';
import {CapacitorSQLite} from '@capacitor-community/sqlite';
import sqliteConnection from '@/data/database/db-connect';
import AppDatasource from "@/data/database/datasources/app-datasource";
import {useDatabaseStores} from "@/stores/database-stores";

export function initDb(dbStores: ReturnType<typeof useDatabaseStores>) {

    return new Promise((resolve, reject) => {
        applyPolyfills().then(() => {
            jeepSqlite(window);
        });

        window.addEventListener('DOMContentLoaded', async () => {

            // Set sqlite to global
            const platform = Capacitor.getPlatform();
            dbStores.platform = platform;
            dbStores.sqliteConnection = sqliteConnection;

            try {

                if (platform === 'web') {
                    const jeepEl = document.querySelector('jeep-sqlite');
                    if (jeepEl != null) {
                        document.body.removeChild(jeepEl);
                    }
                    // Create the 'jeep-sqlite' Stencil component
                    const jeepSqlite = document.createElement('jeep-sqlite');
                    // Auto save
                    jeepSqlite!.autoSave = true;
                    document.body.appendChild(jeepSqlite);
                    await customElements.whenDefined('jeep-sqlite');
                    // Initialize the Web store
                    await sqliteConnection.initWebStore();
                }

                // when using Capacitor, you might want to close existing connections,
                // otherwise new connections will fail when using dev-live-reload
                // see https://github.com/capacitor-community/sqlite/issues/106
                CapacitorSQLite.checkConnectionsConsistency({
                    dbNames: dbStores.databaseNames, // i.e. "i expect no connections to be open"
                    openModes: [],
                }).catch((e: any) => {
                    // the plugin throws an error when closing connections. we can ignore
                    // that since it is expected behaviour
                    console.log(e);
                    return {};
                });

                if (!AppDatasource.isInitialized) {
                    await AppDatasource.initialize();
                }

                await AppDatasource.runMigrations();

                dbStores.dataSource = AppDatasource;

                await dbStores.updateStatus();

                if (platform === 'web') {
                    // save the database from memory to store
                    for (const dbName of dbStores.databaseNames) {
                        await sqliteConnection.saveToStore(dbName);
                    }
                }

                resolve(true);

            } catch (err) {
                reject(new Error(`Error: ${err}`));
                // TODO: 遇到错误时，调用原生库提示用户数据库错误，并打开log位置
            }
        });
    });

}
