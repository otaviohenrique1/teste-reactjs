import { FormEvent, useState } from 'react';
import { Api, Api2, DataCompany, DataCompanyInitialData, DataHistoricalPrice, DataHistoricalPricesInitialData, DataProps, DataProps2, DataPropsInitialData, DataQuote, DataQuoteInitialData } from './services/api';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [buscaEmpresa, setBuscaEmpresa] = useState<string>('');
  const [data, setData] = useState<DataProps>(DataPropsInitialData);

  const [dataErro, setDataErro] = useState<any>('');
  const [dataCompany, setDataCompany] = useState<DataCompany>(DataCompanyInitialData);
  const [dataQuote, setDataQuote] = useState<DataQuote>(DataQuoteInitialData);
  const [dataHistoricalPricesGrafico, setHistoricalPricesGrafico] = useState<DataHistoricalPrice[]>(DataHistoricalPricesInitialData);
  const [dataError, setDataError] = useState<any[]>([]);
  const [dataBuscaEmpresa, setDataBuscaEmpresa] = useState<DataProps2>();
  
  function BuscaEmpresa(symbol: string) {
    Api({
      symbol: symbol,
      type: 'company'
    }).then((data) => {
      setDataCompany(data.data);
      // console.log(data.data);
    }).catch((error) => {
      setDataError(error);
    });
  
    Api({
      symbol: symbol,
      type: 'quote'
    }).then((data) => {
      setDataQuote(data.data);
      // console.log(data.data);
    }).catch((error) => {
      setDataError(error);
    });
  
    Api2({
      symbol: symbol,
      type: 'chart',
      conteudo: '/1m'
      // conteudo: '/5d'
    }).then((data) => {
      setHistoricalPricesGrafico(data.data);
      // console.log(data.data);
      
    }).catch((error) => {
      setDataError(error);
    });
    
    setDataBuscaEmpresa({
      nome_empresa: dataCompany.companyName,
      codigo_empresa: dataCompany.symbol,
      valor_acao: dataQuote.latestPrice,
      porcentagem: dataQuote.changePercent,
      data: dataHistoricalPricesGrafico,
    });
  
    return {
      data: dataBuscaEmpresa,
      error: dataError
    };
  }
  
  async function handleSubmitForm(event: FormEvent) {
    event.preventDefault();
    
    let data = BuscaEmpresa(buscaEmpresa);
    
    if (data.data) {
      let dataChart = data.data.data.map((item) => {
        return {
          uv: item.close,
          name: item.date
        }
      });

      let high_reduce = data.data.data.reduce((valorAnterior, valorAtual) => {
        return (valorAnterior + valorAtual.high);
      }, 0)/data.data.data.length;
      
      let low_reduce = data.data.data.reduce((valorAnterior, valorAtual) => {
        return (valorAnterior + valorAtual.low);
      }, 0)/data.data.data.length;

      let valor_variacao_dinheiro_resultado = high_reduce - low_reduce;

      setData({
        codigo_empresa: data.data.codigo_empresa,
        nome_empresa: data.data.nome_empresa,
        porcentagem: data.data.porcentagem,
        valor_acao: data.data.valor_acao,
        valor_variacao_dinheiro: valor_variacao_dinheiro_resultado,
        data: dataChart,
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
              <li style={{ listStyle: 'none' }}>{`Codigo da empresa => ${(data.codigo_empresa) ? data.codigo_empresa : '-'}`}</li>
              <li style={{ listStyle: 'none' }}>{`Nome da empresa => ${(data.nome_empresa) ? data.nome_empresa : '-'}`}</li>
              <li style={{ listStyle: 'none' }}>{`Porcentagem => ${data.porcentagem}`}</li>
              <li style={{ listStyle: 'none' }}>{`Valor da ação => ${data.valor_acao}`}</li>
              <li style={{ listStyle: 'none' }}>{`Valor variação dinheiro => ${data.valor_variacao_dinheiro}`}</li>
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

/*
let x = [
  { numero: 1, letra: 'a' },
  { numero: 2, letra: 'b' },
  { numero: 3, letra: 'c' },
  { numero: 4, letra: 'd' },
  { numero: 5, letra: 'e' },
];

let b = x.map((item) => {
  return {
    id: item.numero,
    data: item.letra
  };
});

console.log(b);
*/

/*
let x1 = [1,2,3];
let x2 = x1.reduce((k1, k2) => {
  return (k1 + k2);
});
let x3 = x2/x1.length;

let y1 = [
  {id: 1, data: 'a', numero: 1},
  {id: 2, data: 'b', numero: 2},
  {id: 3, data: 'c', numero: 3},
];
let y2 = y1.reduce((k1, { numero }) => {
  return k1 + numero;
}, 0);
let y3 = y2/y1.length;

const arr = [ { x: 1 }, { x: 2 }, { x: 4 } ]
const result = arr.reduce( ( sum, { x } ) => sum + x , 0)
console.log( result );
*/
