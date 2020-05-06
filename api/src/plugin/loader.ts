
export function pluginLoader(pluginName: string, type: string = 'normalizer'): any | null {
    try {
        const plugin = require(`./${type}/${pluginName}/${pluginName}`);

        return new plugin.getPlugin();
    } catch (e) {
        console.log('Could not get plugin config:', e);

        return null;
    }
}