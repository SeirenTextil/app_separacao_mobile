import styled from 'styled-components/native';

export const MainContainer = styled.SafeAreaView`
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



export const ButtonSubmit = styled.TouchableOpacity`
	width: 150px;
	height: 40px;
	margin-top: 15px;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
`;
export const FormView = styled.View`

	width: 100%;
	flex-direction: row;
	gap: 10px;

`;


export const ClienteButton = styled.TouchableOpacity`
	width: 100%;
	height: 50px;
	background-color: #222;
	margin-bottom: 20px;
	justify-content: center;
	padding: 10px;
	border-radius: 8px;
`;
