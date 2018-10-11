import axios from 'axios'
import { ENDPOINTS } from '../endpoints'

const URL = ENDPOINTS.getURL('product');

export const Receta = {
    findOne( recetaElegida ) {
        return new Promise((resolve, reject) => {
            const infoUrl=URL + 'receta/verReceta/' + recetaElegida;
            axios.create({withCredentials: true}).get(infoUrl)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    },
    find( params ) {
        return new Promise((resolve, reject) => {
            const infoUrl= URL + 'receta/find/';
            axios.create({withCredentials: true}).get(infoUrl,{params})
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
    }
};