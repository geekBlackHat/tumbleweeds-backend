/*var mySqlConnectionString = {
    connection: {
        dev: {
          host:'mysql://mysql:3306/',
          port:'3306',
          user:'user642',
          password:'bW4f80EyBRBUlci6',
          database:'tumbleweed'
        },
        qu: {
            host:'mysql://mysql:3306/',
            port:'3306',
            user:'user642',
            password:'bW4f80EyBRBUlci6',
            database:'tumbleweed'
        }
    }
}*/

var mySqlConnectionString = {
    connection: {
        dev: {
          host:'127.0.0.1',
          port:'3306',
          user:'root',
          password:'',
          database:'tumbleweed'
        },
        qu: {
            host:'127.0.0.1',
            port:'3306',
            user:'root',
            password:'',
            database:'tumbleweed'
        }
    }
}


module.exports.mySqlConnectionString = mySqlConnectionString;