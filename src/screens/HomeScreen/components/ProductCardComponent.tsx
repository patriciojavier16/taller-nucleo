import React from 'react'
import { Products } from '../HomeScreen'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { styles } from '../../../theme/styles'
import { IconButton, Text } from 'react-native-paper'

interface Props {
    product: Products,
}

export const ProductCardComponent = ({ product }: Props) => {
    const navigation = useNavigation()

    return (
        <View style={styles.contentProduct}>
            <View>
                <Text variant='labelLarge'>Nombre: {product.name} </Text>
                <Text variant='bodyMedium'>Categoría: {product.category} </Text>
            </View>
            <View style={styles.iconProfile}>
                <IconButton
                    icon="phone"
                    size={25}
                    onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Detail', params: { product } }))}
                />
            </View>
        </View>
    )
}
