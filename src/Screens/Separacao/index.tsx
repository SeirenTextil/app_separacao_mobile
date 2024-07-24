/* eslint-disable @typescript-eslint/no-explicit-any */

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { api } from '../../utils/api';
import { ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import {
	BackButton,
	ButtonFilter,
	ButtonLista,
	ButtonPeca,
	ButtonSubmit,
	ButtonSwitchKeyboard,
	Header,
	MainContainer,
	TextButtonPeca,
	TextInfo,
	ViewInput,
	ViewSepara
} from './styles';
import {
	Text,
	View,
	TextInput,
	KeyboardTypeOptions,
	FlatList,
	TouchableOpacity,
	Alert
} from 'react-native';

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



export default function Separacao({ navigation }: any) {
	const route = useRoute();
	const {
		nomeCli,
		dtEntrada,
		codCli
	}: any = route.params;
	const [responseGaiola, setResponseGaiola] = useState({
		Situacao: '',
	});
	const [tableContent] = useState({
		tableHeaders: ['nota', 'cartão ', 'artigo', 'peça', 'hr. ting.', 'peso', 'gaiola', 'conferido'],
	});
	const [keyboardType, setKeyboardType] = useState<KeyboardTypeOptions | undefined>('numeric');
	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [gaiola, setGaiola] = useState('');
	const [chaveItem, setChaveItem] = useState('');
	const [dados, setDados] = useState<Peca[]>([]);
	const [dadosPeca, setDadosPeca] = useState<DataPecaType>();
	const [guardaGaiolaVisible, setGuardaGaiolaVisible] = useState(false);
	const [showLista, setShowLista] = useState(false);
	const [listData, setListData] = useState<string[][]>([]);
	const [filtered, setFiltered] = useState(false);
	const filteredData = filtered ? listData.filter(item => item[7] === 'Não') : listData;

	useEffect(() => {
		reloadPage();
	}, []);

	useEffect(() => {
		if (dadosPeca?.TipoRetorno === '0') {
			setGuardaGaiolaVisible(true);
			setChaveItem(dadosPeca.ChaveItem);
		} else {
			setGuardaGaiolaVisible(false);
		}
	}, [dadosPeca]);

	const ItemList = ({ item }: ListPeca) => (
		<ButtonPeca onPress={() => handlePressSubmitButton(item.Peca, item.ChaveItem)} key={item.ChaveItem}>
			<TextButtonPeca style={{ fontWeight: 'bold' }}>
				Peça: {item?.Peca}
			</TextButtonPeca>

			<TextButtonPeca >
				Artigo: {item?.Artigo}
			</TextButtonPeca>


		</ButtonPeca>
	);

	async function handlePressSubmitButton(peca: string, chave: string) {
		setShowLista(false);
		setChaveItem(chave);
		setResponseGaiola({ Situacao: '' });
		setValue(peca);
		setLoading(true);

		await api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
			nomeDll: 'InformaPeca',
			parametros: [`${codCli}|${dtEntrada}|${peca}`]
		})
			.then((response) => {
				const data: DataPecaType = response.data.data;
				setDadosPeca(data);

				if (data.Dados) {
					const ListDados = Object.values(data.Dados as Peca[]);
					setDados(ListDados);
				}
				setChaveItem(data.ChaveItem);
				setGaiola(data.Gaiola);
			})
			.catch((err) => {
				Alert.alert('Atenção!', err.message);
			})
			.finally(() => {
				setLoading(false);
			});
		setValue('');

	}

	async function handlePressInformaGaiola(gaiola: string, chave: string, fecharGaiola: 'S' | 'N') {
		setLoading(true);
		if (gaiola && gaiola != null && chave != null && chave != undefined && gaiola != undefined) {
			api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
				nomeDll: 'InformaGaiola',
				parametros: [`${codCli}|${dtEntrada}|${chave}|${gaiola}|${fecharGaiola}`]
			}).then((response) => {
				const data = response.data.data;
				setResponseGaiola(response.data.data);
				setGaiola(data.Gaiola);

				Alert.alert('Atenção!', data.Mensagem);
			}).catch((err) => {
				Alert.alert('Atenção!', err.message);
			}).finally(() => {
				setLoading(false);
				handlePressSubmitButton(value, chave);
			});
		} else {
			Alert.alert('Atenção!', 'Informe uma gaiola válida!');
			handlePressSubmitButton(value, chave);
		}
	}

	function handlePressFecharGaiola() {
		handlePressInformaGaiola(gaiola, chaveItem, 'S');
	}

	function reloadPage() {
		handlePressSubmitButton('', chaveItem);
	}

	async function handlePressLista() {

		if (showLista) {
			setShowLista(false);
			return;
		}

		setLoading(true);
		await api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
			nomeDll: 'LoteSeparar',
			parametros: [`${codCli}|${dtEntrada}`]
		})
			.then((response) => {
				const data = response.data.data;

				const table = Object.entries(data.ListaPecas) as ListaPeca[];
				const tableFormatted = table.map(([, item]) => {
					return [item.Nota, item.Cartao, item.Artigo, item.Peca, item.HrTing, item.Peso, item.Gaiola, item.Confirmado == 'S' ? 'Sim' : item.Confirmado == 'O' ? 'OK' : 'Não'];
				});
				setListData(tableFormatted);
				setShowLista(true);

			})
			.catch((err) => {
				Alert.alert('Atenção!', err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	function filterTable(){
		setFiltered(prevState => !prevState);
	}


	return (
		<MainContainer>
			<Header>
				<Text style={{ color: '#eee', fontSize: 16, fontWeight: '600', maxWidth: 250, }}>{nomeCli} {codCli} - {dtEntrada}</Text>
			</Header>

			<BackButton onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" size={28} color="#000" />
			</BackButton>

			<ViewInput>
				<ButtonSwitchKeyboard onPress={() => setKeyboardType(keyboardType === 'numeric' ? 'twitter' : 'numeric')}>
					{keyboardType === 'numeric'
						? <MaterialCommunityIcons name="alphabetical-variant" size={24} color="#fff" />
						: <MaterialCommunityIcons name="numeric" size={24} color="#fff" />
					}
				</ButtonSwitchKeyboard>

				<TextInput
					style={{ fontSize: 18, width: '60%', backgroundColor: '#fff', height: 50, borderRadius: 10, padding: 10 }}
					keyboardType={keyboardType}
					enterKeyHint='done'
					onChangeText={(a: string) => setValue(a)}
					onEndEditing={() => handlePressSubmitButton(value, chaveItem)}
					value={value}
					placeholder='Número da peça...'
				/>

				<ButtonSubmit onPress={() => handlePressSubmitButton(value, chaveItem)}>
					<Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Enviar</Text>
				</ButtonSubmit>
			</ViewInput>



			<ViewSepara>
				{!showLista &&
					<>
						{
							loading &&
							<ActivityIndicator color={'#fff'} size={30} />
						}
						{!loading && dadosPeca?.Dados != null ?
							<FlatList data={dados && dados} renderItem={({ item }) => <ItemList item={item} />}
								style={{ width: '100%' }}
								contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', gap: 15, padding: 15 }}
								numColumns={3}
								columnWrapperStyle={{ gap: 15 }}
							/>
							: !loading &&
							<View style={{ alignItems: 'center' }}>
								{dadosPeca?.Situacao === '1' &&
									<>
										<TextInfo>
											{dadosPeca?.Mensagem}
										</TextInfo>
									</>
								}
								{dadosPeca?.TipoRetorno === '1' && responseGaiola.Situacao != '0' &&
									<>
										<TextInfo>
											{dadosPeca?.Mensagem}: {dadosPeca?.Gaiola}
										</TextInfo>
										<TextInfo>
											Quantidade: {dadosPeca?.Qtde}
										</TextInfo>
										<View style={{ flexDirection: 'row', gap: 50 }}>
											<TouchableOpacity onPress={() => {

												handlePressInformaGaiola(dadosPeca.Gaiola, dadosPeca.ChaveItem, 'N');
											}
											} style={styles.buttonS}>
												<Text style={{ fontSize: 30, color: '#fff' }}>Sim</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => reloadPage()} style={styles.buttonN}>
												<Text style={{ fontSize: 30, color: '#fff' }}>Não</Text>
											</TouchableOpacity>
										</View>
									</>
								}
								{dadosPeca?.TipoRetorno === '2' &&
									<>
										<TextInfo>
											Fechar Gaiola {gaiola}?
										</TextInfo>
										<TextInfo>
											Quantidade: {dadosPeca?.Qtde}
										</TextInfo>
										<View style={{ flexDirection: 'row', gap: 50 }}>
											<TouchableOpacity onPress={() => handlePressFecharGaiola()} style={styles.buttonS}>
												<Text style={{ fontSize: 30, color: '#fff' }}>Sim</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => reloadPage()} style={styles.buttonN}>
												<Text style={{ fontSize: 30, color: '#fff' }}>Não</Text>
											</TouchableOpacity>
										</View>
									</>
								}
								{dadosPeca?.TipoRetorno === '3' &&
									<>
										<TextInfo>
											{dadosPeca?.Mensagem} {dadosPeca?.Gaiola}
										</TextInfo>
										<TextInfo>
											Quantidade: {dadosPeca?.Qtde}
										</TextInfo>
									</>
								}
								{dadosPeca?.TipoRetorno === '4' &&
									<>
										<TextInfo>
											{dadosPeca?.Mensagem}
										</TextInfo>
										<TextInfo>
											Quantidade: {dadosPeca?.Qtde}
										</TextInfo>
										<TextInfo>
											Gaiola: {dadosPeca?.Gaiola}
										</TextInfo>
									</>
								}

								{guardaGaiolaVisible && responseGaiola.Situacao != '0' &&
									<View>
										<TextInfo>
											{dadosPeca?.Mensagem}
										</TextInfo>
										<View style={{ flexDirection: 'row', width: '100%', gap: 20 }}>
											<TextInput
												style={{ fontSize: 22, width: 250, backgroundColor: '#fff', height: 50, borderRadius: 10, padding: 10 }}
												enterKeyHint='send'
												onChangeText={(a: string) => setGaiola(a)}
												value={gaiola}
											/>
											<ButtonSubmit onPress={() => handlePressInformaGaiola(gaiola, chaveItem, 'N')}>
												<Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Informar Gaiola</Text>
											</ButtonSubmit>
										</View>
										<TextInfo>
											Quantidade: {dadosPeca?.Qtde}
										</TextInfo>
									</View>
								}
							</View>
						}

					</>
				}


			</ViewSepara>

		</MainContainer>
	);
}

const styles = StyleSheet.create({
	buttonS: {
		backgroundColor: '#00aa00',
		padding: 15,
		borderRadius: 35,
		width: 100,
		alignItems: 'center',
		marginTop: 10,

	},
	buttonN: {
		backgroundColor: '#aa0000',
		padding: 15,
		borderRadius: 35,
		width: 100,
		alignItems: 'center',
		marginTop: 10,
	}
});
