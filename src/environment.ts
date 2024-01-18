enum Environments {
    Development = 'dev',
    Production = 'prod',
    Test = 'test',
    Local = 'local'
}

class Environment{
    private envirnment: String;
    
    constructor(envirnment: String) {
        this.envirnment = envirnment;
    }

    getPort() : Number {
        if(this.envirnment == Environments.Production) {
            return 8081;
        }else if(this.envirnment == Environments.Development) {
            return 8082;
        }else if(this.envirnment == Environments.Test) {
            return 8083;
        }else{
            return 3000;
        }
    }

    getDBName () : String {
        if(this.envirnment == Environments.Production) {
            return 'florence_store';
        }else if(this.envirnment == Environments.Development) {
            return 'florence_store_dev';
        }else if(this.envirnment == Environments.Test) {
            return 'florence_store_test';
        }else{
            return 'florence_store_local';
        }
    }

}

export default new Environment(Environments.Local);