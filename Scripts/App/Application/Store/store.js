import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    connectionCodeData: [],
    requestCodeData: [],
    priorityCodeData: [],
    serviceCodeData: [],
    configData: [],
  },
  actions: {
    async findConnection(context) {
      let act = `CSM/Center/ContactType`
      let resp = await $xt.getServer(act)
      context.commit('storeConnection', resp.data.data_rows)
    },
    async findRequest(context) {
      let act = `CSM/Center/RequestType`
      let resp = await $xt.getServer(act)
      context.commit('storeRequest', resp.data.data_rows)
    },
    async findPriority(context) {
      let act = `CSM/Center/Priority`
      let resp = await $xt.getServer(act)
      context.commit('storePriority', resp.data.data_rows)
    },
    async findService(context) {
      let act = `CSM/Center/ServiceType`
      let resp = await $xt.getServer(act)
      context.commit('storeService', resp.data.data_rows)
    },
    async findConfig(context) {
      let act = `CSM/Center/GetSettings`
      let resp = await $xt.getServer(act)
      context.commit('storeConfig', resp.data)
    },
  },
  mutations: {
    storeConnection(state, data) { state.connectionCodeData = data },
    storeRequest(state, data) { state.requestCodeData = data },
    storePriority(state, data) { state.priorityCodeData = data },
    storeService(state, data) { state.serviceCodeData = data },
    storeConfig(state, data) { state.configData = data },
  },
});

global.store = store
export default store
