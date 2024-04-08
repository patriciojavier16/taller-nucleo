import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Divider, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { styles } from '../../../theme/styles'
import { push, ref, set } from 'firebase/database'
import { dbRealTime } from '../../../configs/firebaseConfig'

interface Props {
    visible: boolean,
    setVisible: Function
}

interface ProductForm {
    name: string,
    category: string,
    description: string
}

export const NewProductComponent = ({ visible, setVisible }: Props) => {

    //Hook usestate para actualizar los datos de nuestro formulario
    const [productForm, setProductForm] = useState<ProductForm>({
        name: '',
        category: '',
        description: ''
    })

    //Crear una funcion que capture y actualice los valores del formulario
    const handlerSetProductForm = (key: string, value: string) => {
        setProductForm({ ...productForm, [key]: value })
    }

    //Funcion para guardar los productos
    const handlerSaveProduct = async () => {
        if (!productForm.name || !productForm.category || !productForm.description) {
            return
        }
        const dbRef = ref(dbRealTime, 'products')
        const saveProduct = push(dbRef) //Ubicacion de almacenamiento
        try {
            await set(saveProduct, productForm)
            setProductForm({
                description: '',
                category: '',
                name: ''
            })

        } catch (e) {
            console.log(e)
        }
        setVisible(false)
    }

    return (
        <View>
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.modalProfile}>
                    <View style={styles.headerModal}>
                        <Text variant='headlineMedium'>Nuevo producto</Text>
                        <IconButton icon='close' onPress={() => setVisible(false)} />
                    </View>
                    <Divider bold />
                    <TextInput label='Nombre' mode='outlined' onChangeText={(value) => handlerSetProductForm('name', value)} />
                    <TextInput label='Categoría' mode='outlined' onChangeText={(value) => handlerSetProductForm('category', value)} />
                    <TextInput label='Descripción' mode='outlined' onChangeText={(value) => handlerSetProductForm('description', value)} multiline={true} numberOfLines={6} />
                    <Button style={{ marginTop: 20 }} mode='contained' onPress={() => handlerSaveProduct()}>Guardar</Button>
                </Modal>
            </Portal>
        </View>
    )
}
