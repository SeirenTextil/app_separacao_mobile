/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { api } from '../../utils/api';
import { ActivityIndicator, KeyboardTypeOptions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ButtonMic } from '../../components/ButtonMic';
import * as Speech from 'expo-speech';
import {
	BackButton,
	ButtonPeca,
	ButtonSubmit,
	ButtonSwitchKeyboard,
	Header,
	MainContainer,
	styles,
	TextButtonPeca,
	TextInfo,
	ViewInput,
	ViewSepara
} from './styles';
import {
	Text,
	View,
	TextInput,
	FlatList,
	TouchableOpacity,
	Alert
} from 'react-native';


export default function Separacao({ navigation }: any) {
	const route = useRoute();
	const { nomeCli, dtEntrada, codCli }: any = route.params; // Get params from previous page
	const [responseGaiola, setResponseGaiola] = useState({Situacao: ''});
	const [loading, setLoading] = useState(false);
	const [gaiola, setGaiola] = useState('');
	const [chaveItem, setChaveItem] = useState('');
	const [dados, setDados] = useState<Peca[]>([]);
	const [dadosPeca, setDadosPeca] = useState<DataPecaType>();
	const [guardaGaiolaVisible, setGuardaGaiolaVisible] = useState(false);
	const [showLista, setShowLista] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [keyboardType, setKeyboardType] = useState<KeyboardTypeOptions>('numeric');
	const [value, setValue] = useState('');

	// eslint-disable-next-line prefer-const
	let msg;
	useEffect(() => {
		//reset values
		reloadPage();
		Speech.getAvailableVoicesAsync().then((response) =>
			console.log(response)

		);

	}, []);

	useEffect(() => {
		//logic to show btnGaiola
		if (dadosPeca?.TipoRetorno === '0') {
			setGuardaGaiolaVisible(true);
			setChaveItem(dadosPeca.ChaveItem);
		} else {
			setGuardaGaiolaVisible(false);
		}
	}, [dadosPeca]);

	//Create items for the table
	const ItemList = ({ item }: ListPeca) => (
		<ButtonPeca onPress={() => handleSubmit(item.Peca, item.ChaveItem)} key={item.ChaveItem}>
			<TextButtonPeca style={{ fontWeight: 'bold' }}>
        Peça: {item?.Peca}
			</TextButtonPeca>
			<TextButtonPeca >
        Artigo: {item?.Artigo}
			</TextButtonPeca>
		</ButtonPeca>
	);

	//Function to speak the text returned by the API
	function speak(thingToSay: string){
		Speech.speak(thingToSay,{
			rate: 2
		});
	}

	async function handleSubmit(peca: string, chave: string) {
		setValue(peca);
		setShowLista(false);
		setChaveItem(chave);
		setResponseGaiola({ Situacao: '' });
		setLoading(true);

		// Call API 'InformaPeca'
		await api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
			nomeDll: 'InformaPeca',
			parametros: [`${codCli}|${dtEntrada}|${peca}`]
		})
			.then((response) => {
				const data: DataPecaType = response.data.data;
				setDadosPeca(data);

				//see if dados exist
				if (data.Dados) {
					const ListDados = Object.values(data.Dados as Peca[]); //format data
					setDados(ListDados);
				}
				setChaveItem(data.ChaveItem);
				setGaiola(data.Gaiola);

				//set message to speak
				msg =
					` ${data.Mensagem}
            ${data.Qtde.length > 0 ? 'Quantidade:' + data.Qtde : ''}
            ${data.Gaiola.length > 0 ? ',Gaiola:' + data.Gaiola : ''}`;

				speak(msg); //speak the message
			})
			.catch((err) => {
				Alert.alert('Atenção!', err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	//function to inform the gaiola, and if it has to be closed
	async function handlePressInformaGaiola(gaiola: string, chave: string, fecharGaiola: 'S' | 'N') {
		setLoading(true);
		//make sure that all params are valid
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
				//call the API to check the status
				handleSubmit(value, chave);
			});
		} else {
			Alert.alert('Atenção!', 'Informe uma gaiola válida!');
			//set the message
			msg = 'Informe uma gaiola válida!';
			//speak the message
			speak(msg);
			//call the API to check the status
			handleSubmit(value, chave);

		}
	}

	//function to close the gaiola
	function handlePressFecharGaiola() {
		handlePressInformaGaiola(gaiola, chaveItem, 'S');
	}

	//function reset values
	function reloadPage() {
		handleSubmit('', chaveItem);
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
				<ButtonSwitchKeyboard
					onPress={() => setKeyboardType(keyboardType === 'numeric' ? 'twitter' : 'numeric')}
				>

					{keyboardType === 'numeric'
						? <MaterialCommunityIcons name="alphabetical-variant" size={24} color="#fff" />
						: <MaterialCommunityIcons name="numeric" size={24} color="#fff" />
					}

				</ButtonSwitchKeyboard>

				<TextInput
					style={{ fontSize: 18, width: '60%', backgroundColor: '#fff', height: 50, borderRadius: 10, padding: 10 }}
					enterKeyHint='done'
					keyboardType={keyboardType}
					onChangeText={(a: string) => setValue(a)}
					onEndEditing={() => handleSubmit(value, chaveItem)}
					value={value}
					placeholder='Número da peça...'
					onPress={() => setValue('')}
				/>

				<ButtonSubmit onPress={() => handleSubmit(value, chaveItem)}>
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
							<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
											Gaiola: {dadosPeca.Gaiola.length > 0 ? dadosPeca.Gaiola : 'Não encontrada'}
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
			<ButtonMic
				isListening={isListening} setIsListening={setIsListening}
				setTextResult={(a) => handleSubmit(a, chaveItem)}
			/>
		</MainContainer>
	);
}


