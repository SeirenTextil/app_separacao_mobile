import { LogBox, PermissionsAndroid, Platform, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import {  GravacaoButton, GravacaoContainer} from './styles';
import { FontAwesome } from '@expo/vector-icons';
import Voice, { SpeechStartEvent } from '@react-native-voice/voice';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

interface ButtonMicProps{
  setTextResult: (value: string) => void;
  setIsListening: (value: boolean) => void;
  isListening: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ButtonMic({setTextResult, setIsListening, isListening}: ButtonMicProps) {
	const [, setAudioPermission] = useState(Boolean);
	const [isAvailable, setIsAvailable] = useState<boolean>();

	useEffect(() => {
		//Declare all functions to receive the response of Voice
		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechEnd = stopListing;
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechError = () => {setTextResult('');};
		Voice.getSpeechRecognitionServices();
		//check if the device is available for speech recognition
		Voice.isAvailable().then((response) => {
			if (!response) {
				Alert.alert('Atenção!', 'Dispositivo não suportado para reconhecimento de voz');
				setIsAvailable(false);
				setTextResult('Dispositivo não suportado!');
			} else {
				setIsAvailable(true);
			}
		});
		return () => {
			Voice.destroy().then(Voice.removeAllListeners);
		};
	}, []);

	useEffect(() => {
		// Check if the device has permission to record audio
		async function getPermission() {
			if (Platform.OS === 'android') {
				try {
					const granted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
						{
							title: 'Permissão de Gravação de Áudio',
							message: 'Este aplicativo precisa de acesso ao áudio para reconhecimento de fala.',
							buttonNeutral: 'Pergunte-me Depois',
							buttonNegative: 'Cancelar',
							buttonPositive: 'OK',
						}
					);
					setAudioPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
				} catch (err) {
					console.warn(err);
				}
			} else {
				const { status } = await Audio.requestPermissionsAsync();
				setAudioPermission(status === 'granted');
			}
		}
		getPermission();
	}, []);

	//Function to when starting to speak
	const onSpeechStart = (event: SpeechStartEvent) => {
		console.log('Recording Started...: ', event);
	};

	//Funtion to get the result from speech recognition
	const onSpeechResults = event => {
		const textArray = event.value;
		console.log(event);

		let result = '';

		// Filter out numbers from the text array
		for (const text of textArray) {
			if (/\d/.test(text)) { // Check if the string has a number
				result = text;
				break;
			}
		}

		setTextResult(result);
	};

	//Function to start listening to speech
	const startListing = async () => {
		setIsListening(true);
		try {
			await Voice.start('pt-BR');
		} catch (error) {
			Alert.alert('Error starting voice recognition:', error.message);
		}
	};

	//Function to stop listening to speech
	const stopListing = async () => {
		try {
			await Voice.stop();
			Voice.removeAllListeners();
			setIsListening(false);
		} catch (error) {
			Alert.alert('Error stopping voice recognition:', error.message);
		}
	};

	//Function to handle button press
	function handlePressButton() {
		isListening ? stopListing() : startListing();
	}

	return (
		<GravacaoContainer>
			<GravacaoButton
				onPress={() => {
					handlePressButton();
				}}
				disabled={!isAvailable}
			>
				<FontAwesome name={isListening ? 'stop' : 'microphone'} size={54} color="white" >
				</FontAwesome>
			</GravacaoButton>
		</GravacaoContainer>

	);
}
