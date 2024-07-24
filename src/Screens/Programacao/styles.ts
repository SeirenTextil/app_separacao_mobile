import { DataTable } from 'react-native-paper';
import styled from 'styled-components/native';

export const MainContainer = styled.View`
	flex: 1;
	height: 100%;
	width: 100%;
	background-color: #000;
	justify-content: flex-start;
	align-items: center;
`;

export const Header = styled.View`
	width: 100%;
	height: 90px;
	background-color: #333;
	position: fixed;
	top: 0;
	justify-content: center;
	align-items: center;
	padding-top: 30px;
`;

export const TableCell = styled(DataTable.Cell)`
  flex: 1;
  margin: 2px;
  padding: 5px 2px;
  align-items: center;
  justify-content: center;
  min-width: 65px;
  text-overflow: clip;
  white-space: normal;
`;

export const ErrorText = styled.Text`
	color: #fff9;
  font-size: 30px;
  font-weight: 400;
	text-align: center;
	margin-top: 10px;
`;

export const ErrorConteiner = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
