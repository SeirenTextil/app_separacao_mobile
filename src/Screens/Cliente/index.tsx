/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, ScrollView, Text, View } from 'react-native';
import { ClienteButton, Header, MainContainer } from './styles';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import ModalCliente from '../../components/ModalCliente';
import { ActivityIndicator } from 'react-native-paper';

type ListaClI = [string, {
    CodCli:   string;
    Fantasia: string;
}]
export default function Cliente(){
	const [isLoading, setIsLoading] = useState(false);
	const [listaCli, setListaCli] = useState<ListaClI[]>([]);
	const [currentCli, setCurrentCli] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [codCli, setCodCli] = useState('');

	useEffect(() => {
		//get all the Costumers
		handleSubmit();
	}, []);

	//function to get all the Costumers
	async function handleSubmit(){
		await api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
			nomeDll: 'ClienteSeparar',
			parametros: ['']
		}).then((response) => {
			const {data} = response.data;
			//format data
			const ListaCli = Object.entries(data.ListaCli) as ListaClI[];
			setListaCli(ListaCli);
		}).catch((error) => {
			Alert.alert('Ocorreu um erro!',error);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	//function to handle the press of a Customer
	async function handlePressCliente(codCli: string, cliente: string) {
		setCurrentCli(cliente);
		setCodCli(codCli);
		setIsLoading(true); //"fake loading"
		setIsModalVisible(true);
	}


	return(
		<>
			<ModalCliente
				cliente={currentCli}
				isModalVisible={isModalVisible}
				codCli={codCli}
				onClose={() => {
					setIsModalVisible(false);
					setIsLoading(false);
				}}
			/>
			<MainContainer>
				<Header>
					<Text style={{color: '#eee', fontSize: 22, fontWeight: '700'}}>SELECIONE UM CLIENTE:</Text>
				</Header>
				<View style={{flex: 1, width: '100%', padding: 10}}>
					{!isLoading &&
					<ScrollView contentContainerStyle={{marginTop: 12}}>
						{listaCli.map(([,item], index) => index != 0 && (
							<ClienteButton onPress={() => handlePressCliente(item.CodCli, item.Fantasia)} key={item.CodCli}>
								<Text style={{color: '#fff'}}>{item.Fantasia}</Text>
							</ClienteButton>
						))}
					</ScrollView>
					}

					{isLoading &&
						<View style={{flex: 1, width: '100%', justifyContent: 'center', alignContent: 'center'}}>
							<ActivityIndicator color='#fff'/>
						</View>
					}
				</View>
			</MainContainer>
		</>
	);
}
