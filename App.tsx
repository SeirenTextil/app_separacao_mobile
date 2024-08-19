import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Programacao from './src/Screens/Programacao';
import Separacao from './src/Screens/Separacao';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cliente from './src/Screens/Cliente';
import { useEffect } from 'react';
import { Audio } from 'expo-av';

export default function App() {
	useEffect(() => {
		// Request audio permissions on app launch
		async function load() {
			const { status } = await Audio.getPermissionsAsync();

			if (status !== 'granted') {
				await Audio.requestPermissionsAsync();
			}
		}
		load();
		return () => {};
	}, []);

	const Tab = createMaterialTopTabNavigator();
	const Stack = createStackNavigator();

	function TabNavigation() {
		// Customize tab bar appearance and behavior here
		return (
			<Tab.Navigator
				tabBarPosition='bottom'
				screenOptions={{
					tabBarInactiveTintColor: '#555',
					tabBarActiveTintColor: '#00ffff',
					tabBarStyle:{backgroundColor: '#000'},
					tabBarIndicatorStyle: {backgroundColor: '#00ffff'},
					tabBarLabelStyle: {fontSize: 12}
				}}
				initialRouteName='Programação'
				backBehavior='initialRoute'
			>
				<Tab.Screen  name="Cliente" component={Cliente} />
				<Tab.Screen name="Programação" component={Programacao} />
			</Tab.Navigator>
		);
	}


	return (
		<PaperProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{headerShown: false}}>
					<Stack.Screen name='TabNavigation' component={TabNavigation}/>
					<Stack.Screen name='Separacao' component={Separacao}/>
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}


