import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
import InfoReceta from './views/InfoReceta.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/search/:busquedaProp?',
            name: 'search',
            component: List,
            props: true
        },
        {
            path: '/infoReceta/:recetaElegida',
            name: 'infoReceta',
            component: InfoReceta,
            props: true
        }
    ]
})
