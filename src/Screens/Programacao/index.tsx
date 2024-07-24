/* eslint-disable no-mixed-spaces-and-tabs */
import { ActivityIndicator, DataTable, Text } from 'react-native-paper';
import { Header, MainContainer, TableCell } from './styles';
import { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { api } from '../../utils/api';
import ButtonSepara from '../../components/ButtonSepara';
import { useNavigation } from '@react-navigation/native';

type TableType = [string, {
  Cartao: string,
  Cliente: string,
  CodCli: string,
  Entrada: string,
  HoraSuper: string,
  Programado: string,
  TotalPecas: string,
}];

type ItemsType = [string, {
  ListaFila: string,
  Data: string,
}];

type DropDownType = { label: string; value: string; };
export default function Programacao(){
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<DropDownType[]>([]);
	const [value, setValue] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [tableData, setTableData] = useState<TableType[]>([]);
	const [selectedItem, setSelectedItem] = useState<TableType[1]>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const navigation = useNavigation<any>();


	useEffect(() => {
		setLoading(true);
		api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
			nomeDll: 'FilaSupPrep',
			parametros: ['']
		})
			.then((response) => {
				const {data} = response.data;
				const date = Object.entries(data.ListaFila) as ItemsType[];
				const DropDownValue = date.map(([,item]) => {
					return { label: item.Data, value: item.Data };
				});
				setItems(DropDownValue);
			})
			.catch((error) => Alert.alert('Ocorreu um erro!', 'Ocorreu um erro na execução do processo: ' + error))
			.finally(() => setLoading(false));

	}, []);

	function handleChangeData(data: string | null) {
		setSelectedItem(undefined);
		if (data != null) {
			const dataFormatted =  data.split(' ').slice(0, 2).join(' ');
			setLoading(true);
			api.post('AbrideiraDesenroladeira/chama-dll?deviceName=TBT-SEPARACAO', {
				nomeDll: 'DetFilaSupPrep',
				parametros: [dataFormatted]
			}).then((response) =>
			{
				const {data} = response.data;
				const table = Object.entries(data.ListaFila) as TableType[];

				if (data.Situacao === '1') {
					setErrorMessage(data.Mensagem);
					setTableData([]);
				}
				else{
					setTableData(table);

					setErrorMessage('');
				}

			}).catch((error) => {
				Alert.alert('Ocorreu um erro!', 'Ocorreu um erro na execução do processo: ' + error.message);
			}).finally(() => {
				setLoading(false);
			});
		}
	}

	function handlePressSepara(){
		const itemsToSend = {
			codCli: selectedItem?.CodCli,
			cartao: selectedItem?.Cartao,
			dtEntrada: selectedItem?.Entrada,
			nomeCli: selectedItem?.Cliente
		};
		navigation.navigate('Separacao', itemsToSend);
	}

	return(
		<MainContainer>
			<Header>
				<Text numberOfLines={0} style={{color: '#eee', fontSize: 22, fontWeight: '700'}}>SEPARAR ATÉ:</Text>
			</Header>

			<View>
				<DropDownPicker
					loading={loading}
  				language='PT'
					style={{
						marginTop: 10,
						backgroundColor: '#464646',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					placeholder='SELECIONE UMA DATA:'
					closeOnBackPressed
					closeAfterSelecting
					open={open}
					value={value}
					items={items}
					setOpen={setOpen}
					theme='DARK'
					setValue={setValue}
					setItems={setItems}
					dropDownContainerStyle={{backgroundColor: '#2c2c2c', marginTop: 10, height: 200}}
					hideSelectedItemIcon={true}
					showArrowIcon={true}
					showTickIcon={true}
					arrowIconContainerStyle={{position: 'absolute', right: 0, marginRight: 10}}
					textStyle={{color: '#fff', textAlign: 'center'}}
					onChangeValue={(data) => handleChangeData(data)}
					tickIconContainerStyle={{position: 'absolute', right: 10}}
				/>
			</View>

			{!loading && tableData.length > 0 &&
      	<ScrollView
      	contentContainerStyle={{justifyContent: 'center', paddingBottom: 10}}
      	stickyHeaderIndices={[0]}
      	style={styles.scrollView}
      	refreshControl={
      		<RefreshControl
      			refreshing={false}
      			onRefresh={() => handleChangeData(value)}
      		/>
      	}
      	>


      	<DataTable.Header style={styles.tableHeader}>
      		<DataTable.Title textStyle={styles.title}>CLIENTE</DataTable.Title>
      		<DataTable.Title textStyle={styles.title}>DATA</DataTable.Title>
      		<DataTable.Title textStyle={styles.title}>TOTAL PÇS</DataTable.Title>
      		<DataTable.Title textStyle={styles.title}>HR. SUPER.</DataTable.Title>
      	</DataTable.Header>

      	<DataTable>

      		{tableData?.map(([index, item]) => (
      			<DataTable.Row  onPress={() => setSelectedItem(item)}
      				key={index} style={[styles.row, {backgroundColor: selectedItem === item ? '#222aa5' : '#333'}]}>
      				<TableCell numberOfLines={undefined} textStyle={styles.textRow}>{item.Cliente}</TableCell>
      				<TableCell numberOfLines={undefined} textStyle={styles.textRow}>{item.Entrada}</TableCell>
      				<TableCell numberOfLines={undefined} textStyle={styles.textRow}>{item.TotalPecas}</TableCell>
      				<TableCell maxFontSizeMultiplier={100} numberOfLines={undefined} textStyle={styles.textRow}>{item.HoraSuper}</TableCell>
      			</DataTable.Row>
      		))}

      	</DataTable>

      	</ScrollView>
			}

			{loading &&
      <View style={{flex: 1, width: '100%', justifyContent: 'center', alignContent: 'center'}}>
       	<ActivityIndicator color='#fff'/>
      </View>
			}

			{!loading && tableData.length > 0 &&
			<ButtonSepara onPress={() => handlePressSepara()} pressable={!!selectedItem}/>
			}
		</MainContainer>
	);
}

const styles = StyleSheet.create({
	dataTable: {
		backgroundColor: '#333',
	},
	tableHeader: {
		marginTop: 10,
		backgroundColor: '#444',
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
	},
	title: {
		fontSize: 12,
		fontWeight: '900',
		color: '#fff',
		textAlign: 'center',
		flex: 1,
	},
	textRow: {
		fontSize: 10,
		color: '#fff',
		textAlign: 'center',
	},
	row: {
		maxHeight: '100%',
		backgroundColor: '#333',
		flexDirection: 'row'
	},
	scrollView: {
		height: '100%',
		width: '100%',
		marginBottom: 5,
		flex: 1,
		padding: 5,

	},
});
