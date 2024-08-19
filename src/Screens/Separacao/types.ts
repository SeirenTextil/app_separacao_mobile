interface ListPeca {
	item: Peca;
}

interface Peca {
	Nota: string;
	Cartao: string;
	Artigo: string;
	Peca: string;
	Compr: string;
	Peso: string;
	Gaiola: string;
	Conferido: string;
	ChaveItem: string;
}

interface DataPecaType {
	Situacao: string;
	Mensagem: string;
	TipoRetorno: string;
	Gaiola: string;
	Qtde: string;
	ChaveItem: string;
	Dados: Peca[] | null;
}

type ListaPeca = [string, {
	Nota: string;
	Cartao: string;
	Tipo: string;
	Artigo: string;
	Peca: string;
	HrTing: string;
	Peso: string;
	Gaiola: string;
	Confirmado: string;
	Chave: string;
	Item: string;
	NotaFatura: string;
	SetorProdu: string;
}]
