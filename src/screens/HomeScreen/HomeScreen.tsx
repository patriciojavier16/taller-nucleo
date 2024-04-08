import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { styles } from '../../theme/styles';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, dbRealTime } from '../../configs/firebaseConfig';
import firebase from 'firebase/auth'
import { onValue, ref } from 'firebase/database';
import { ProductCardComponent } from './components/ProductCardComponent';
import { NewProductComponent } from './components/NewProductComponent';

//Interface que nos ayude a trabajar con los datos del usuario - nombre
interface UserForm {
  name: string
}

//Interface para trabajar la data de la carta
export interface Products {
  id: string,
  name: string,
  category: string,
  description: string
}

export const HomeScreen = () => {

  //Hook para controlar la visibilidad del modal new leter
  const [showModalProduct, setShowModalProduct] = useState(false)

  //Hook para tomar la lista de cartas
  const [products, setProducts] = useState<Products[]>([])

  //Hook para controlar la visibilidad del modal
  const [showModalProfile, setShowModalProfile] = useState(false)

  //Hook permite trabajar con los datos del usuario - nombre
  const [userForm, setUserForm] = useState<UserForm>({
    name: ''
  })

  const [userAuth, setUserAuth] = useState<firebase.User | null>(null)

  //Hook useEffect: Capturar la data del usuario logueado
  useEffect(() => {
    setUserAuth(auth.currentUser) //Datos del usuario logueado
    setUserForm({ name: auth.currentUser?.displayName ?? '' })
    getAllProducts()


  }, [])

  //Funcion para tomar los datos del formulario y actualizar la data
  const handlerUpdateUserForm = (key: string, value: string) => {
    setUserForm({ ...userForm, [key]: value })
  }
  {

  }

  //Funcion que actualiza la data del usuario loguado
  const handlerUpdateUser = async () => {
    try {
      await updateProfile(userAuth!, { displayName: userForm.name })
    } catch (e) {
      console.log(e)
    }
    setShowModalProfile(false)
  }

  //Funcion para obtenerr las cartas almacenadas
  const getAllProducts = () => {
    const dbRef = ref(dbRealTime, 'products')
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val()
      const getKeys = Object.keys(data)
      const listProducts: Products[] = []
      getKeys.forEach((key) => {
        const value = { ...data[key], id: key }
        listProducts.push(value)
      })
      setProducts(listProducts)
    })
  }

  return (
    <>
      <View style={styles.contentHome}>
        <View style={styles.headerHome}>
          <Avatar.Text size={55} label="PM" />
          <View>
            <Text variant='bodySmall'>Bienvenido</Text>
            <Text variant='labelLarge'>{userForm.name}</Text>
          </View>
          <View style={styles.iconProfile}>
            <IconButton
              icon="cog"
              size={30}
              mode='contained'
              onPress={() => setShowModalProfile(true)}
            />
          </View>
        </View>
        <View>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCardComponent product={item} />}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      <Portal>
        <Modal visible={showModalProfile} contentContainerStyle={styles.modalProfile}>
          <View style={styles.headerModal}>
            <Text variant='displayMedium'>Mi perfil</Text>
            <IconButton icon='close' onPress={() => setShowModalProfile(false)}></IconButton>
          </View>
          <Divider bold />
          <TextInput mode='outlined' label='Nombre' value={userForm.name}
            onChangeText={(value) => handlerUpdateUserForm('name', value)} />
          <TextInput mode='outlined' label='Correo' value={userAuth?.email!} />
          <Button mode='contained' onPress={() => handlerUpdateUser()}>Actualizar</Button>
        </Modal>
      </Portal>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowModalProduct(true)}
      />
      <NewProductComponent visible={showModalProduct} setVisible={setShowModalProduct} />
    </>
  )
}