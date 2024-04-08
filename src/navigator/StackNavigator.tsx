import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { styles } from '../theme/styles';
import { DetailProductScreen } from '../screens/HomeScreen/DetailProductScreen';

interface Routes {
    name: string,
    screen: () => JSX.Element, //Elemento jsx un screen
    headerShow?: boolean
    title?: string
}

const Stack = createStackNavigator();

export const StackNavigator = () => {

    //Hook para controlar la carga inicial de screen
    const [isLoading, setIsLoading] = useState(false)

    //Jook para verificar si esta logueado o no
    const [isAuth, setIsAuth] = useState(false)

    //Home useEffect: validar el estado de autenticacion
    useEffect(() => {
        setIsLoading(true)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true)
                //console.log("Rutas: " + user.email);
            }
            setIsLoading(false)
        })
    }, [])


    //Arreglo de rutas para el usuario que no esta autenticado
    const routesNoAuth: Routes[] = [
        { name: "Login", screen: LoginScreen },
        { name: "Register", screen: RegisterScreen }

    ]
    //Arreglo de rutas para el usuario que si esta autenticado
    const routesAuth: Routes[] = [
        { name: "Home", screen: HomeScreen },
        { name: "Detail", screen: DetailProductScreen, headerShow: true, title: 'Detalle carta' }
    ]

    return (
        <>
            {
                isLoading ? (
                    <View style={styles.content}>
                        <ActivityIndicator size={35} />
                    </View>
                ) : (
                    <Stack.Navigator>
                        {
                            !isAuth ?
                                routesNoAuth.map((item, index) => (
                                    <Stack.Screen key={index} name={item.name} options={{ headerShown: false }} component={item.screen} />
                                ))
                                :
                                routesAuth.map((item, index) => (
                                    <Stack.Screen key={index} name={item.name} options={{ headerShown: item.headerShow ?? false, title: item.title }} component={item.screen} />
                                ))
                        }
                    </Stack.Navigator>
                )
            }
        </>
    );
}