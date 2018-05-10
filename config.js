export default class config {
  static env = 'dev'

  static envs = {
    dev: {
      baseUrl: 'https://dev-ajax.coconut.com'
    },
    staging: {
      baseUrl: 'https://staging-ajax.coconut.com'
    },
    prod: {
      baseUrl: 'https://ajax.coconut.com'
    }
  }

  static getBaseUrl = () => {
    return config.envs[config.env].baseUrl
  }
}
