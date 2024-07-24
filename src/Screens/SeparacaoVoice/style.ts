import styled from 'styled-components/native';

export const BackButton = styled.TouchableOpacity`
	background-color: #d3d3d3;
	width: 50px;
	height: 50px;
	border-radius: 40px;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 9999;
`;

export const MainContainer = styled.SafeAreaView`
	flex: 1;
	height: 100%;
	width: 100%;
	background-color: #000;
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

export const InfoContainer = styled.View`
	flex: 1;
	justify-content: center;
`;

export const TextInfo = styled.Text`
	font-size: 32px;
	color: #fff;
`;

export const GravacaoContainer = styled.View`
	padding: 20px 0px;
`;

export const GravacaoButton = styled.TouchableOpacity`
	padding: 28px 32px;
	background-color: #dc2626;
	border-radius: 64px;
`;
