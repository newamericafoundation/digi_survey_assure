export class BaseNormalizerClass {
    private __config: any;

    public async runHook(name: string, action: string, data: any = {}): Promise<any> {
        try {
            const hook = require(`${__dirname}/${this.constructor.name.toLowerCase()}/hooks/${name}.${action}`);

            return hook.run(this.config, data);
        } catch (e) {
            console.log('Error running or loading plugin hook:', e);

            return null;
        }
    }

    get config(): any { return this.__config; }
    set config(config: any) { this.__config = config; }
}
