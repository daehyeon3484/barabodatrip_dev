import {
    createStore
} from 'vuex'

// npm install vuex@next --save
import persistedstate from 'vuex-persistedstate';

const store = createStore({
    state() {
        return {
        user: {}
        }
    },
    mutations: {
        user(state, data) {
            state.user = data;
        }
    },
    plugins: [
        persistedstate({
            paths: ['user']
        })
    ]
});

export default store;