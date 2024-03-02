export const getPayerFromTransaction = async (
  transactionHash: string,
  chainId: string | number
) => {
  const endpoints: any = {
    1: 'https://lb.drpc.org/ogrpc?network=ethereum&dkey=AlJLQo6AmUCSojrybRpuoL1eZYba2DoR7qLWGtyyLTIM',
    10: 'https://lb.drpc.org/ogrpc?network=optimism&dkey=AlJLQo6AmUCSojrybRpuoL1eZYba2DoR7qLWGtyyLTIM',
    8453: 'https://lb.drpc.org/ogrpc?network=base&dkey=AlJLQo6AmUCSojrybRpuoL1eZYba2DoR7qLWGtyyLTIM',
    7777777:
      'https://lb.drpc.org/ogrpc?network=zora&dkey=AlJLQo6AmUCSojrybRpuoL1eZYba2DoR7qLWGtyyLTIM'
  };
  try {
    const response = await fetch(endpoints[chainId], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 0,
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [transactionHash]
      })
    });
    const data: any = await response.json();
    return data.result.from;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching transaction:', err);
    return '';
  }
};
