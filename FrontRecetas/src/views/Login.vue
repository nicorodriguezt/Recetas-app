<template>
    <v-form v-model="valid">
        <v-text-field
                v-model="Usuario.UserName"
                :rules="nameRules"
                label="Usuario"
                required
        ></v-text-field>
        <v-text-field
                v-model="Usuario.Password"
                :rules="passwordRules"
                :type="'password'"
                label="Contraseña"
                required
        ></v-text-field>
        <v-btn color="blue" @click="login">Ingresar</v-btn>
    </v-form>

</template>

<script>

    import axios from 'axios'

    export default {
        name: 'Login',
        data() {
            return {
                Usuario: {},
                errors: [],
                valid: false,
                name: '',
                nameRules: [
                    v => !!v || 'Name is required',
                    v => v.length <= 10 || 'Name must be less than 10 characters'
                ],
                password: '',
                passwordRules: [
                    v => !!v || 'Password is required'
                ]
            }
        },
        methods: {
            login(evt) {
                evt.preventDefault()
                axios.post(`http://localhost:3000/usuario/login`, this.Usuario)
                    .then(response => {
                        localStorage.setItem('logged', response.data.passport.user);
                        this.$router.push({
                            name: '/'
                        })
                    })
                    .catch(e => {
                        console.log(e)
                        this.errors.push(e)
                    })
            },
            register() {
                this.$router.push({
                    name: 'Register'
                })
            }
        }
    }
</script>
