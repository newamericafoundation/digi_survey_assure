
export class BaseVisualizerClass {
    private __config: any;

    get config(): any { return this.__config; }
    set config(config: any) { this.__config = config; }
}
