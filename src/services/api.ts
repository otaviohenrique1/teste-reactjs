import axios from "axios";

// https://cloud.iexapis.com/stable/stock/aapl/company
export const api = axios.create({
  // baseURL: 'https://sandbox.iexapis.com/stable/stock/',
  baseURL: 'https://cloud.iexapis.com/stable/stock/',
});

interface ApiProps {
  symbol: string;
  type: 'chart' | 'company' | 'quote';
  conteudo?: string;
  opcoes?: string
}

export function Api({ symbol, type, conteudo, opcoes }: ApiProps) {
  const url = `${symbol}/${type}${conteudo || ''}?token=${process.env.REACT_APP_API_KEY}${opcoes || ''}`;
  return api.get(url);
};

export function Api2({ symbol, type, conteudo, opcoes }: ApiProps) {
  const url = `${symbol}/${type}${conteudo}?token=${process.env.REACT_APP_API_KEY}${opcoes || ''}`;
  return api.get(url);
};

export interface DataCompany {
  symbol: string; // codigo_empresa
  companyName: string; // nome_empresa
}

export const DataCompanyInitialData: DataCompany = {
  symbol: '',
  companyName: ''
};

export interface DataQuote {
  symbol: string; // codigo_empresa
  companyName: string; // nome_empresa
  latestPrice: number; // valor_acao
  // high: number;
  // low: number;
  // high - low = valor_variacao_dinheiro
  changePercent: number; // porcentagem
}

export interface DataHistoricalPrices {
  // grafico
  data: DataHistoricalPrice[];
}

export interface DataHistoricalPrice {
  // grafico
  // symbol: string; // codigo_empresa
  close: number; // uv => no grafico
  date: string; // name => no grafico
  high: number,
  low: number
  // high - low = valor_variacao_dinheiro
}

export const DataHistoricalPriceInitialData: DataHistoricalPrice = {
  // symbol: '',
  close: 0,
  date: '',
  high: 0,
  low: 0,
};

export const DataHistoricalPricesInitialData = [];

export const DataQuoteInitialData: DataQuote = {
  symbol: '',
  companyName: '',
  latestPrice: 0,
  // high: 0,
  // low: 0,
  changePercent: 0
};

export interface DataValorVariacaoDinheiro {
  high: number;
  low: number;
}

export interface DataProps4 {
  nome_empresa: string;
  codigo_empresa: string;
  porcentagem: number;
  valor_acao: number;
  valor_variacao_dinheiro: DataValorVariacaoDinheiro;
  data: DataHistoricalPrice[];
}

export interface DataProps3 {
  nome_empresa: string;
  codigo_empresa: string;
  porcentagem: number;
  valor_acao: number;
  valor_variacao_dinheiro: number;
  data: DataHistoricalPrice[];
}

export interface DataProps2 {
  nome_empresa: string;
  codigo_empresa: string;
  porcentagem: number;
  valor_acao: number;
  data: DataHistoricalPrice[];
}

export interface DataProps {
  nome_empresa: string;
  codigo_empresa: string;
  porcentagem: number;
  valor_acao: number;
  valor_variacao_dinheiro: number;
  data: {
    uv: number,
    name: string
  }[];
}

export const DataPropsInitialData = {
  nome_empresa: '',
  codigo_empresa: '',
  porcentagem: 0,
  valor_acao: 0,
  valor_variacao_dinheiro: 0,
  data: []
}


/*
  Historical Prices => /stock/{symbol}/chart/{range}/{date}
    Exemplo => https://cloud.iexapis.com/stable/stock/AAPL/chart/5d?token=YOUR_TOKEN_HERE
    Exemplo => https://cloud.iexapis.com/stable/stock/AAPL/chart/date/20210730?token=YOUR_TOKEN_HERE
  Company => /stock/{symbol}/company
    Exemplo => https://cloud.iexapis.com/stable/stock/AAPL/company?token=YOUR_TOKEN_HERE
  Quote => /stock/{symbol}/quote/{field}
    Exemplo => https://cloud.iexapis.com/stable/stock/AAPL/quote/latestPrice?token=YOUR_TOKEN_HERE
*/
