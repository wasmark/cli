export interface Config {
  endpoint?: string;
  contracts: RetrivedContract[];
  mnemonics: string[];
}

export interface RetrivedContract {
  name: string;
  path: string;
  artifact: Buffer;
}