import React, { useEffect } from 'react';
import { Alert, Modal, Text, View } from 'react-native';
import { ModalView, TableHeader, TableRow, TableHeaderText, TableView, TableRowText, CloseButton } from './styles';
import { useState } from 'react';
import { api } from '../../utils/api';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { TableNotaType } from './types';
import { useNavigation } from '@react-navigation/native';

interface ModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    cliente: string;
		codCli: string;
		dtEntradaTable?: string;
		pecasTable?: string;
}


export default function ModalCliente({ isModalVisible, onClose, cliente, codCli, dtEntradaTable, pecasTable }: ModalProps) {
	const [showInfo, setShowInfo] = useState(false);
	const [tableNota, setTableNota] = useState<TableNotaType[]>([]);
	const [loading, setLoading] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const navigation = useNavigation<any>();

	useEffect(() => {
		setLoading(true);
		if (codCli != '' && codCli != null && codCli.length > 0){
			api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
				nomeDll: 'NotasSeparar',
				parametros: [codCli]
			}).then((response) =>
			{
				const {data} = response.data;
				const ListaNota = Object.entries(data.ListaNota) as TableNotaType[];


				if (dtEntradaTable != undefined && pecasTable != undefined && dtEntradaTable.length > 0 && pecasTable.length > 0) {

					const filteredArray = ListaNota.filter(item => {
						const dateString = item[1].Data;
						return dateString === dtEntradaTable;
					});

					setTableNota(filteredArray);

				}else{
					setTableNota(ListaNota);
				}
			}
			).catch((error) => Alert.alert('Atenção!', error.message))
				.finally(() => setLoading(false));
		}
	},[codCli]);

	function closeModal() {
		if (loading === false) {
			setShowInfo(false);
			onClose();
		}
	}

	function renderHeader(){
		return (
			<TableHeader>
				<TableHeaderText>DT. ENTRADA</TableHeaderText>
				<TableHeaderText>TOTAL PÇS.</TableHeaderText>
				<TableHeaderText>NÃO SEP.</TableHeaderText>
			</TableHeader>
		);
	}

	function renderItem({item}: {item: TableNotaType}) {
		return (
			<TableRow key={item[1].Data} onPress={() => redirectSepara(item[1].Data)}>
				<TableRowText>{item[1].Data}</TableRowText>
				<TableRowText>{item[1].Total}</TableRowText>
				<TableRowText>{item[1].Separar}</TableRowText>
			</TableRow>
		);
	}

	function redirectSepara(dtEntrada: string){
		navigation.navigate('Separacao', {
			nomeCli: cliente,
			codCli: codCli,
			dtEntrada: dtEntrada
		});
		onClose();
	}

	return (
		<Modal
			visible={isModalVisible}
			transparent
			onRequestClose={closeModal}
			animationType='fade'
		>

			{ loading === false &&
			<ModalView>
				<CloseButton onPress={() => closeModal()}>
					<Ionicons name="close" size={30} color="white" />
				</CloseButton>

				{showInfo == false  && (
					<View  style={{alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 20, marginBottom: 15, fontWeight: 'bold' }}>{cliente.toLocaleUpperCase()}</Text>
						<TableView>
							<FlatList
								data={tableNota}
								renderItem={renderItem}
								ListHeaderComponent={renderHeader}
								stickyHeaderIndices={[0]}
							/>
						</TableView>
					</View>
				)}
			</ModalView>
			}

		</Modal>
	);
}

