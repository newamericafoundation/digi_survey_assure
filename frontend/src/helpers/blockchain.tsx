
export function buildConfirmationLink(txId: string, network: string): string {
    return `https://${network}.etherscan.io/tx/${txId}`;
}
