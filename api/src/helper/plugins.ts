import { readdirSync } from 'fs';

export function getPluginList(pluginType: string): string[] {
    if (!confirmType(pluginType)) {
        return [];
    }

    try {
        return readdirSync(`${__dirname}/../plugin/${pluginType}`, { withFileTypes: true })
            .filter((element: any) => element.isDirectory())
            .map((element: any) => element.name);
    } catch (e) {
        console.log('Could not get plugin listings', e);

        return [];
    }
}

function confirmType(pluginType: string): boolean {
    switch (pluginType) {
        case 'formula':
        case 'normalizer':
        case 'visualizer':
            return true;
        default:
            return false;
    }
}