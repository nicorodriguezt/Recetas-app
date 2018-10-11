<template>
    <v-app>
        <v-navigation-drawer
                persistent
                :mini-variant="miniVariant"
                :clipped="clipped"
                v-model="drawer"
                enable-resize-watcher
                fixed
                app
        >
            <v-list>
                <v-list-tile
                        value="true"
                        v-for="(item, i) in items"
                        :key="i"
                        :href="item.ref"
                >
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                app
                :clipped-left="clipped"
        >
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-content>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                clipped: true,
                drawer: false,
                fixed: false,
                items: [
                    {
                        icon: 'home',
                        title: 'Menu principal',
                        ref: '#/'
                    },
                    {
                        icon: 'search',
                        title: 'Buscar recetas',
                        ref: '#/search/'
                    }],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Recetas'
            }
        }
    }
</script>
