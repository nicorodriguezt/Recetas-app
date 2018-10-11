<template>
    <div class="buscar-style">
        <v-layout>
            <v-flex>
                <v-text-field v-model="busqueda" append-icon="search" name="buscar" placeholder="Buscar..."
                              type="text"></v-text-field>
                <v-btn @click="handleBuscar" color="primary">BUSCAR</v-btn>
                <div>
                    <v-card v-for="receta in recetas"
                            :key="receta._id" v-if="receta">
                        <v-img
                                :src="image.image"
                                aspect-ratio="2.75"
                        ></v-img>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">{{receta.Nombre}}</h3>
                                <div>{{receta.Descripcion}}</div>
                            </div>
                        </v-card-title>
                        <div align="right">
                            <v-btn flat color="purple" @click="verReceta(receta._id)">Ver más
                                <v-icon>arrow_right</v-icon>
                            </v-btn>
                        </div>
                        <v-spacer></v-spacer>
                    </v-card>
                </div>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <div align="center" v-if="pagina!==0">
                <div v-if="pagina!==1">
                    <v-btn flat icon @click="backward">
                        <v-icon>arrow_back_ios</v-icon>
                    </v-btn>
                </div>

                <span>{{pagina}}</span>

                <div v-if="controlPaginas===6">
                    <v-btn flat icon @click="forward">
                        <v-icon>arrow_forward_ios</v-icon>
                    </v-btn>
                </div>
            </div>

        </v-layout>

    </div>
</template>

<script>
    import axios from 'axios';
    // import {apiURL} from "../environment/globalConfig";

    export default {
        props: ['busquedaProp'],
        data() {
            return {
                image: {
                    image: 'https://t1.rg.ltmcdn.com/es/images/3/0/7/ternera_salteada_al_estilo_chino_70703_600.jpg'
                },
                busqueda: '',
                skip: 0, limit: 6,
                recetas: [],
                pagina: 0,
                controlPaginas: 0
            }
        },
        methods: {
            buscar: function () {
                this.recetas = [];
                if (this.busqueda !== '') {
                    let params = {
                        Nombre: this.busqueda,
                        Saltar: this.skip,
                        Limite: this.limit
                    };
                    axios.create({withCredentials: true}).get('http://localhost:3000/receta/find/', {params}).then(datos => {
                        if (datos.data.length !== 0) {
                            this.controlPaginas = datos.data.length;
                            this.pagina++;
                            for (let i = 0; i < 5; i++) {
                                this.recetas.push(datos.data[i]);
                            }
                            this.recetas.forEach(function (element) {
                                element.Nombre = element.Nombre[0].toUpperCase() + element.Nombre.substr(1).toLowerCase();
                            });
                        }

                    });
                }
            },
            handleBuscar: function () {
                this.skip = 0;
                this.limit = 6;
                this.pagina = 0;
                this.buscar()
            },
            forward: function () {
                this.skip += 5;
                this.limit += 5;
                this.buscar()

            },
            backward: function () {
                this.skip -= 5;
                this.limit -= 5;
                this.pagina--;
                this.pagina--;
                this.buscar()
            },
            verReceta: function (recetaElegida) {
                const busquedaProp = this.busqueda;
                this.$router.push({name: 'infoReceta', params: {recetaElegida, busquedaProp}});
            }
        },
        mounted() {
            if (this.busquedaProp !== undefined) {
                this.busqueda = this.busquedaProp;
                this.buscar();
            }
        }
    }
</script>

<style>
    .buscar-style {
        padding: 10px;
    }
</style>
