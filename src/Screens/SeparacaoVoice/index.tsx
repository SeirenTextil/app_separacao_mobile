import { Text, LogBox } from 'react-native';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { BackButton, GravacaoButton, GravacaoContainer, Header, InfoContainer, MainContainer, TextInfo } from './style';
import { FontAwesome } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import { Ionicons } from '@expo/vector-icons';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

export function SeparacaoVoice({navigation}: any) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [, setAudioPermission] = useState(Boolean);
	const [isLoading, setIsLoading] = useState(false);
	const [textResult, setTextResult] = useState('INFORME O NÚMERO DA PEÇA!');
	const [isListening, setIsListening] = useState(false);

	useEffect(() => {
		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechEnd = stopListing;
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechError = error => console.log('onSpeechError: ', error);

		return () => {
			Voice.destroy().then(Voice.removeAllListeners);
		};
	}, []);

	useEffect(() => {
		async function getPermission() {
			await Audio.requestPermissionsAsync().then((permission) => {
				setAudioPermission(permission.granted);
			}).catch(error => {
				console.log(error);
			});
		}

		getPermission();


	}, []);


	const onSpeechStart = (event: Event) => {
		console.log('Recording Started...: ', event);
	};

	const onSpeechResults = event => {
		console.log('Result: ', event);
		const text = event.value[0];
		setTextResult(text);
	};

	const startListing = async () => {
		setIsListening(true);
		try {
			await Voice.start('pt-BR');
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const stopListing = async () => {
		try {
			await Voice.stop();
			Voice.removeAllListeners();
			setIsListening(false);
		} catch (error) {
			console.log('Error:', error);

		}
	};

	function handlePressButton(){

		isListening ? startListing() : startListing();

	}

	return (
		<MainContainer>
			<BackButton onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" size={28} color="#000" />
			</BackButton>
			<Header>
				<Text style={{color: '#eee', fontSize: 22, fontWeight: '600'}}>SEPARAÇÃO</Text>
			</Header>
			<InfoContainer>
				<TextInfo style={{color: '#fff'}}>{textResult}</TextInfo>
			</InfoContainer>
			<GravacaoContainer>
				<GravacaoButton
					onPress={() => {
						handlePressButton();
					}}
					disabled={isLoading}
				>
					<FontAwesome name={isListening ? 'stop-circle' : 'circle'} size={64} color="white" />
				</GravacaoButton>
			</GravacaoContainer>
		</MainContainer>
	);
}
