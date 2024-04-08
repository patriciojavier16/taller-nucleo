import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, TextInput, Button, Snackbar } from 'react-native-paper'
import { auth } from '../configs/firebaseConfig';
import { styles } from '../theme/styles';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface RegisterForm {
  email: string,
  password: string
}

interface MessageSnackBar {
  visible: boolean,
  message: string,
  color: string
}

export const RegisterScreen = () => {

  //Hook de navegacion
  const navigation = useNavigation()

  //Hook para mostrar la contraseña
  const [hiddenPassword, setHiddenPassword] = useState(true)


  //Hook useState: trabajar con el estado del formulario
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: "",
    password: ""
  });

  //Hook usestate mensajes dinamicos
  const [messageSnackBar, setMessageSnackBar] = useState<MessageSnackBar>({
    visible: false,
    message: "",
    color: "#fff"
  })

  //Funcion para actualizar datos del formulario
  const handlerSetRegisterForm = (key: string, value: string) => {
    setRegisterForm({ ...registerForm, [key]: value })
  };

  //Funcion que toma los datos del registro
  const handlerRegister = async () => {
    if (!registerForm.email || !registerForm.password) {
      //Cambiar el estado para ver el mensaje
      //setShowMessage(true)
      setMessageSnackBar({ visible: true, message: "Complete todos los campos", color: '#9D2323' })
      return;
    }

    //Registrar usuario
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        registerForm.email,
        registerForm.password
      );
      setMessageSnackBar({ visible: true, message: "Registro exitoso", color: '#41A752' })
    } catch (e) {
      console.log(e);
      setMessageSnackBar({ visible: true, message: "Registro fallido, intente denuevo", color: '#BA3C25' })

    }
  }

  return (
    <View style={styles.content}>
      <Text variant='headlineMedium'>Registrate</Text>
      <TextInput style={styles.inputs}
        mode="outlined"
        label="Correo"
        placeholder="Escribe tu correo"
        onChangeText={(value) => handlerSetRegisterForm('email', value)}
      />
      <TextInput style={styles.inputs}
        mode="outlined"
        label="Contraseña"
        placeholder="Escribe tu contraseña"
        secureTextEntry={hiddenPassword}
        right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
        onChangeText={(value) => handlerSetRegisterForm('password', value)}
      />
      <Button mode="contained" onPress={() => handlerRegister()} style={styles.buttons}>Registrarse
      </Button>
      <Snackbar visible={messageSnackBar.visible} onDismiss={() => setMessageSnackBar({ ...messageSnackBar, visible: false })} style={{ backgroundColor: messageSnackBar.color }}>{messageSnackBar.message}
      </Snackbar>
      <Text style={styles.textNavigation} onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Login' }))}>Ya tienes una cuenta? Inicia seción</Text>
    </View>
  );
};

