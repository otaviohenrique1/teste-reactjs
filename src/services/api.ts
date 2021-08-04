import axios from "axios";
import { useState } from "react";

// https://cloud.iexapis.com/stable/stock/aapl/company
export const api = axios.create({
  // baseURL: 'https://sandbox.iexapis.com/stable/stock/',
  baseURL: 'https://cloud.iexapis.com/stable/stock/',
});

interface ExemploApiProps {
  symbol: string;
  type: 'chart' | 'company' | 'quote';
  conteudo?: string;
  opcoes?: string
}

export function Api({ symbol, type, conteudo, opcoes }: ExemploApiProps) {
  const url = `${symbol}/${type}${conteudo || ''}?token=${'pk_183b3fe4ee7a4ab3acecb8f12791b338'}${opcoes || ''}`;
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
  high: number;
  low: number;
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
  date: Date; // name => no grafico
}

export const DataHistoricalPriceInitialData: DataHistoricalPrice = {
  // symbol: '',
  close: 0,
  date: new Date(`${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`)
};

export const DataHistoricalPricesInitialData = [];

export const DataQuoteInitialData: DataQuote = {
  symbol: '',
  companyName: '',
  latestPrice: 0,
  high: 0,
  low: 0,
  changePercent: 0
};

export interface DataProps {
  nome_empresa: string;
  codigo_empresa: string;
  porcentagem: number;
  valor_acao: number;
  valor_variacao_dinheiro: number;
  data: DataHistoricalPrice[];
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
