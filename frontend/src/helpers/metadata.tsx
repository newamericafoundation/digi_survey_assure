
export function grabKeyFromMetadata(key: string, metadata: any): string | null {
    return (metadata && (key in metadata) && metadata[key]) ? metadata[key] : null;
}
