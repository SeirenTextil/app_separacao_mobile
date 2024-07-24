import styled from 'styled-components/native';

export const ModalView = styled.SafeAreaView`
	background-color: #0009;
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 15px;
`;

export const TableView = styled.View`
	background-color: #EEE;
	width: 100%;
	max-height: 90%;
	padding: 10px;
	border-radius: 10px;
`;

export const TableRow = styled.TouchableOpacity`
	background-color: #111;
	width: 100%;
	min-height: 50px;
	border-radius: 10px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 5px;
	margin-bottom: 10px;
`;


export const TableHeader = styled.View`
	width: 100%;
	min-height: 30px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #EEE;
`;

export const TableHeaderText = styled.Text`
	width: 100px;
	text-align: center;
	flex-wrap: wrap;
	font-weight: 800;
	color: #000;
	flex: 1;

`;

export const TableRowText = styled.Text`
	width: 100px;
	text-align: center;
	flex-wrap: wrap;
	color: #fff;
	flex: 1;

`;

export const FilterButton = styled.TouchableOpacity`
	background-color: #fff;
	width: 200px;
	min-height: 40px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
`;

export const CloseButton = styled.TouchableOpacity`
	width: 50px;
	height: 50px;
	border-radius: 40px;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 20px;
	right: 20px;
`;
