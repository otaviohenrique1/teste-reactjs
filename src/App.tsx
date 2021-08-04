import { FormEvent, useState } from 'react';
import { Api, DataCompany, DataCompanyInitialData, DataHistoricalPrice, DataHistoricalPricesInitialData, DataProps, DataPropsInitialData, DataQuote, DataQuoteInitialData } from './services/api';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [buscaEmpresa, setBuscaEmpresa] = useState<string>('');
  const [data, setData] = useState<DataProps>(DataPropsInitialData);
  const [dataErro, setDataErro] = useState<any>('');
  const [dataCompany, setDataCompany] = useState<DataCompany>(DataCompanyInitialData);
  const [dataQuote, setDataQuote] = useState<DataQuote>(DataQuoteInitialData);
  const [dataHistoricalPricesGrafico, setHistoricalPricesGrafico] = useState<DataHistoricalPrice[]>(DataHistoricalPricesInitialData);
  const [dataError, setDataError] = useState<any[]>([]);
  const [dataBuscaEmpresa, setDataBuscaEmpresa] = useState<DataProps>();
  
  function BuscaEmpresa(symbol: string) {
    Api({
      symbol: symbol,
      type: 'company'
    }).then((data) => {
      setDataCompany(data.data)
    }).catch((error) => {
      setDataError(error);
    });
  
    Api({
      symbol: symbol,
      type: 'quote'
    }).then((data) => {
      setDataQuote(data.data)
    }).catch((error) => {
      setDataError(error);
    });
  
    Api({
      symbol: symbol,
      type: 'chart',
      conteudo: '/date/5d'
    }).then((data) => {
      setHistoricalPricesGrafico(data.data)
    }).catch((error) => {
      setDataError(error);
    });
    
    setDataBuscaEmpresa({
      nome_empresa: dataCompany.companyName,
      codigo_empresa: dataCompany.symbol,
      valor_acao: dataQuote.latestPrice,
      porcentagem: dataQuote.changePercent,
      valor_variacao_dinheiro: (dataQuote.high - dataQuote.low),
      data: dataHistoricalPricesGrafico,
    });
  
    return {
      data: dataBuscaEmpresa,
      error: dataError
    };
  }

  function handleSubmitForm(event: FormEvent) {
    event.preventDefault();
    
    let data = BuscaEmpresa(buscaEmpresa);

    if (data.data) {
      setData({
        codigo_empresa: data.data.codigo_empresa,
        nome_empresa: data.data.nome_empresa,
        porcentagem: data.data.porcentagem,
        valor_acao: data.data.valor_acao,
        valor_variacao_dinheiro: data.data.valor_variacao_dinheiro,
        data: data.data.data,
      });
    } else {
      setDataErro(data.error);
      console.log(dataErro);
    }
  }
  
  return (
    <div style={{ textAlign: 'center', margin: '1em' }}>
      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          value={buscaEmpresa}
          onChange={event => setBuscaEmpresa(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <br />
      <div>
        {(!data) ? (
          <h1>Sem dados</h1>
        ) : (
          <div>
            <ul>
              <li style={{ listStyle: 'none' }}>{data.codigo_empresa}</li>
              <li style={{ listStyle: 'none' }}>{data.nome_empresa}</li>
              <li style={{ listStyle: 'none' }}>{data.porcentagem}</li>
              <li style={{ listStyle: 'none' }}>{data.valor_acao}</li>
              <li style={{ listStyle: 'none' }}>{data.valor_variacao_dinheiro}</li>
            </ul>
            <LineChart width={700} height={300} data={data.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Line type="monotone" dataKey="uv" stroke="#0047BB" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                itemStyle={styleTooltip}
                labelStyle={styleTooltip}
                contentStyle={styleTooltip}
                wrapperStyle={styleTooltip}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}

const styleTooltip: React.CSSProperties = {
  color: 'white',
  background: '#0047BB',
};

export default App;