export const getPayerFromTransaction = async (
  transactionHash: string,
  chainId: string | number
) => {
  const endpoints: any = {
    1: 'https://eth.rpc.hypersync.xyz',
    10: 'https://optimism.rpc.hypersync.xyz',
    8453: 'https://base.rpc.hypersync.xyz',
    7777777: 'https://zora.rpc.hypersync.xyz'
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
