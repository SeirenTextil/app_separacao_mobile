import styled from 'styled-components/native';

export const MainContainer = styled.View`
	flex: 1;
	height: 100%;
	width: 100%;
	background-color: #000;
	align-items: center;
	justify-content: center;
`;

export const Header = styled.View`
	width: 100%;
	height: 100px;
	background-color: #333;
	position: fixed;
	top: 0;
	justify-content: center;
	align-items: center;
	padding-top: 30px;
`;

export const BackButton = styled.TouchableOpacity`
	background-color: #d3d3d3;
	width: 50px;
	height: 50px;
	border-radius: 40px;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 30px;
	left: 20px;
	z-index: 1;
`;

export const ViewSepara = styled.View`
	width: 100%;
	flex: 1;
	align-items: center;
	justify-content: center;
	height: 100%;
`;


export const ViewInput = styled.View`
	gap: 15px;
	width: 90%;
	margin-top: 20px;
	align-items: center;
	flex-direction: row;
	justify-content: center;
	`;

export const ButtonSwitchKeyboard = styled.TouchableOpacity`
	width: 50px;
	height: 50px;
	background-color: #d20;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
`;

export const ButtonSubmit = styled.TouchableOpacity`
	width: 20%;
	height: 50px;
	background-color: #159100;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	min-width: 90px;
	max-width: 150px;
`;

export const ViewButtons = styled.View`
	flex: 1;
	gap: 10px;
	width: 80%;
	padding: 20px;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;


export const ButtonPeca = styled.TouchableOpacity`
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	background-color: #fff4;
	width: 120px;
	padding: 10px;
`;

export const TextButtonPeca = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
	text-align: center;
`;

export const TextInfo = styled.Text`
  font-size: 35px;
  font-weight: 400;
  color: #fff;
	text-align: center;
`;

interface ButtonListaProps {
	color: string;
}

export const ButtonLista = styled.TouchableOpacity<ButtonListaProps>`
	background-color: ${({color}: ButtonListaProps) => color};
	min-width: 50px;
	height: 50px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 30px;
	right: 30px;
	z-index: 1;
	padding: 10px;
`;


export const ButtonFilter = styled.TouchableOpacity`
	background-color: #0908;
	min-width: 50px;
	height: 50px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 30px;
	left: 30px;
	z-index: 1;
	padding: 10px;
`;
