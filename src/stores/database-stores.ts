import { defineStore } from "pinia";
import { type Ref, ref, type UnwrapRef } from "vue";

export const useDatabaseStores = defineStore('databaseStore', () => {
  const sqliteConnection = ref();
  const platform = ref();

  return { sqliteConnection, platform };
});