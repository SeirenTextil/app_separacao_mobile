import styled from 'styled-components/native';

interface ButtonProps {
	disabled: boolean;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
	width: 100%;
	height: 50px;
	background-color: ${(props: ButtonProps) => (props.disabled ? '#666' : '#15803d')};
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	display: block;
	margin-top: 10px;
	margin-bottom: 10px;
	bottom: 0;
`;
