declare module '*/contract.Json' {
  interface ContractInfo {
    contractAddress: string;
    abi: {
      type: string;
      name: string;
      inputs: {
        name: string;
        type: string;
        internalType: string;
      }[];
      outputs: {
        name: string;
        type: string;
        internalType: string;
      }[];
      stateMutability: string;
    }[];
  }

  const contractInfo: ContractInfo;
  export default contractInfo;
} 