export const ENDPOINTS = {
  development: {
    product: 'http://localhost:3000/'
  },
  staging: {
    product: 'http://localhost:3000/'
  },
  production: {
    product: '/'
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
