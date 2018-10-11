export const ENDPOINTS = {
  development: {
    product: 'http://localhost:3000/api'
  },
  staging: {
    product: 'http://localhost:3000/api'
  },
  production: {
    product: '/api'
  },
  getURL( service )  {
    let env = process.env.NODE_ENV;
    let environment= this;
    console.log('Environment:' +env);
    console.log('Servicio:' +service);
    if( !environment[env] )
      throw 'Environment not found';
    
    console.log(`CurrentEndpoint: ${environment[env].product}`)
    return environment[env][service];
  }
}
