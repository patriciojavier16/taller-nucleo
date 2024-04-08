import React, { useState } from "react";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { styles } from "../theme/styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";

interface LoginForm {
  email: string;
  password: string;
}

interface MessageSnackBar {
  visible: boolean;
  message: string;
  color: string;
}

export const LoginScreen = () => {
  //Hook navegacion entre screens
  const navigation = useNavigation()

  //Hook para mostrar la contrasena
  const [hiddenPassword, setHiddenPassword] = useState(true)

  //Hook useState: trabajar con el estado del formulario
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  //Hook useState: trabajar con el manejo de mensajes dinámicos
  const [messageSnackBar, setMessageSnackBar] = useState<MessageSnackBar>({
    visible: false,
    message: "",
    color: "#fff",
  });

  //Función para actualizar datos del formulario
  const handlerSetLoginForm = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };

  const handlerLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      // cambiar estado para visualizar el mensaje
      setMessageSnackBar({
        visible: true,
        message: "Complete todos los campos",
        color: "#962841",
      });
      return;
    }
    //Login usuario
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
    } catch (e) {
      console.log(e);
      setMessageSnackBar({
        visible: true,
        message: "Usuario y/o contraseña incorrecta",
        color: "#962841",
      });
    }
  };

  return (
    <View style={styles.content}>
      <Text variant="headlineMedium">Inicia Sesión</Text>
      <TextInput
        mode="outlined"
        label="Correo"
        placeholder="Escribe tu correo"
        style={styles.inputs}
        onChangeText={(value) => handlerSetLoginForm("email", value)}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Escribe tu contraseña"
        secureTextEntry={hiddenPassword}
        right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
        style={styles.inputs}
        onChangeText={(value) => handlerSetLoginForm("password", value)}
      />
      <Button
        mode="contained"
        onPress={() => handlerLogin()}
        style={styles.buttons}
      >
        Iniciar
      </Button>
      <Snackbar
        visible={messageSnackBar.visible}
        onDismiss={() =>
          setMessageSnackBar({ ...messageSnackBar, visible: false })
        }
        style={{ backgroundColor: messageSnackBar.color }}
      >
        {messageSnackBar.message}
      </Snackbar>
      <Text
        style={styles.textNavigation}
        onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Register' }))}
      >
        No tienes una cuenta? Regístrate ahora
      </Text>
    </View>
  );
};