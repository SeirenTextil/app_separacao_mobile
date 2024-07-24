import { Button } from './styles';
import { Text } from 'react-native';

interface ButtonProps{
	onPress: () => void;
	pressable: boolean;
}

export default function ButtonSepara({onPress, pressable}: ButtonProps){
	return(
		<Button disabled={!pressable} onPress={() => onPress()}>
			<Text style={{color:'#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 1}}>SEPARAR</Text>
		</Button>
	);
}
