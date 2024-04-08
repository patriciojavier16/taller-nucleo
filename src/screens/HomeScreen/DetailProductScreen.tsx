import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { styles } from '../../theme/styles'
import { Button, Divider, Text, TextInput } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Products } from './HomeScreen'
import { ref, remove, update } from 'firebase/database'
import { dbRealTime } from '../../configs/firebaseConfig'

export const DetailProductScreen = () => {

    //Navegacion
    const navigation = useNavigation()

    //Acceder a los parametros de navegacion
    const route = useRoute()
    //@ts-ignore
    const { product } = route.params

    const [detailForm, setDetailForm] = useState<Products>({
        id: '',
        name: '',
        category: '',
        description: ''
    })

    useEffect(() => {
        setDetailForm(product)
    }, [])

    //Funcion que permita actualizar la data del formulario
    const handlerSetDetailForm = (key: string, value: string) => {
        setDetailForm({ ...detailForm, [key]: value })
    }

    //Funcion que me permita actualizar la carta
    const handlerUpdateProduct = async () => {
        //Referencia a la base de datos
        const dbRef = ref(dbRealTime, 'products/' + detailForm.id)
        await update(dbRef, { category: detailForm.category, description: detailForm.description })
        navigation.goBack()
    }

    //Funcion para eliminar producto
    const handlerDeleteProduct = async () => {
        const dbRef = ref(dbRealTime, 'products/' + detailForm.id)
        await remove(dbRef)
        navigation.goBack()
    }

    return (
        <View style={styles.contentDetail}>
            <View style={styles.categoryProduct}>
                <Text variant='headlineSmall'>Categoría: </Text>
                <TextInput value={detailForm.category} onChangeText={(value) => handlerSetDetailForm('category', value)} style={{ flex: 1 }} />
            </View>
            <Divider bold />
            <View>
                <Text variant='bodyLarge'>Nombre: {detailForm.name}</Text>
            </View>
            <Divider bold />
            <View>
                <Text style={styles.textMessage}>Descripcion:</Text>
                <TextInput
                    value={detailForm.description}
                    multiline={true}
                    numberOfLines={7}
                    onChangeText={(value) => handlerSetDetailForm('message', value)} />
            </View>
            <Button mode='contained' icon='update' onPress={() => handlerUpdateProduct()}>Actualizar</Button>
            <Button mode='contained' icon='delete' onPress={() => handlerDeleteProduct()}>Eliminar</Button>
        </View>
    )
}
