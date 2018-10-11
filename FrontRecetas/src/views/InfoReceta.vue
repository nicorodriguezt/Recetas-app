<template>
    <div v-if="infoReceta" class="verReceta-style">
        <div align="center">
            <h1>{{infoReceta.Nombre}}</h1>
            <v-img
                    src="https://t1.rg.ltmcdn.com/es/images/3/0/7/ternera_salteada_al_estilo_chino_70703_600.jpg"
                    aspect-ratio="2.75"
            ></v-img>
            <p class="descr-style">{{infoReceta.Descripcion}}</p>
        </div>
        <div class="info-style">
            <p><v-icon class="icon-style col-sm-6">info</v-icon>{{infoReceta.Porciones}} Porcion/es</p>
            <p><v-icon class="icon-style col-sm-6">done</v-icon>{{infoReceta.Calorias}} Calorias</p>
            <p><v-icon class="icon-style col-sm-6">restaurant</v-icon>
            <span v-for="momento in infoReceta.MomentoDelDia" :key="momento._id">
        {{momento.Nombre}} -
            </span></p>
        </div>
        <div align="left">
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">Ingrediente</h3>
                </v-card-title>
                <v-list>
                    <v-list-tile
                            v-for="ingrediente in infoReceta.Ingredientes"
                            :key="ingrediente._id"
                    >
                        <p>{{ingrediente.Ingrediente.Nombre}} -&nbsp;&nbsp;{{ingrediente.Cantidad}} {{ingrediente.Unidad}}</p>
                    </v-list-tile>
                </v-list>
            </v-card>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">Como preparar</h3>
                </v-card-title>
                <div v-for="paso in infoReceta.Pasos"
                     :key="paso"
                    class="pasos-style">
                    <p><b>--</b> {{paso}}</p>
                </div>
            </v-card>
        </div>
        <div>
            <v-btn @click="volver">Volver</v-btn>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "infoReceta",
        props: ['recetaElegida', 'busquedaProp'],
        data() {
            return {
                infoReceta: null
            }
        },
        methods: {
          volver: function () {
              const busquedaProp = this.busquedaProp;
              this.$router.push({name: 'search', params: {busquedaProp}})
          }  
        },
        mounted() {
            axios.create({withCredentials: true}).get('http://localhost:3000/receta/verReceta/' + this.recetaElegida).then(datos => {
                this.infoReceta = datos.data;

                this.infoReceta.Nombre = this.infoReceta.Nombre[0].toUpperCase() +  this.infoReceta.Nombre.substr(1).toLowerCase();
                this.infoReceta.Ingredientes.forEach(function (element) {
                    element.Ingrediente.Nombre = element.Ingrediente.Nombre[0].toUpperCase() + element.Ingrediente.Nombre.substr(1).toLowerCase();
                });
            })

        }
    }

</script>

<style scoped>
    .descr-style {
        text-align: justify;
        padding-left: 10px;
        padding-right: 10px;

    }
    .pasos-style {
        text-align: justify;
        padding-left: 10px;
        padding-right: 10px;
    }
    .info-style {
        font-style: italic;
        font-weight: bold;
        font-size: 14px;
        vertical-align: middle;

    }


</style>