import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView, TextInput } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import api from '../services/api';
import { RouteProp, useNavigation } from '@react-navigation/native';

interface Props {
  route: RouteProp<{params: {id: number}}, 'params'>
}

interface Student {
  id: number,
  name: string,
  profileImg: string,
  zipcode: string,
  city: string,
  state: string,
  neighborhood: string,
  street: string,
  number: string,
  complement: string,
}

export default function List({ route }: Props) {
  const { id } = route.params
  const navigation = useNavigation();

  const [student, setStudent] = useState<Student>();

  const [modalVisible, setModalVisible] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      try {
        const response = await api.get(`/students/${id}`);

        setStudent(response.data);

        setLoadingData(false);
      } catch (err) {
        console.log(err);
        setLoadingData(false);
      }
    }

    loadStudent();
  }, []);

  function handleEdit() {
    navigation.navigate('form', { id });
  }

  async function handleDelete() {
    try{
      await api.delete(`/students/${id}`);

      navigation.navigate('index', { id });
    } catch (err) {
      console.log(err);
    }
  }

  function handleDeleteConfirm() {
    
    Alert.alert(
      "Excluir",
      "Deseja excluir o aluno?",
      [
        {
          text: "Não",
          onPress: () => setModalVisible(visible => !visible),
          style: "cancel"
        },
        { text: "Sim", onPress: handleDelete }
      ]
    );
  }

  return (
    <>
      {loadingData || !student ? (
        <View style={styles.loading }>
          <ActivityIndicator size="large" color="#3CB371" />
        </View>
      ) : (
        <ScrollView>
          <Header name="cleiton" type={1} setModal={() => setModalVisible(visible => !visible)} />
          {student.profileImg ? (
            <Image source={{uri: student.profileImg}} style={styles.profileImg} />
          ) : (
            <View style={styles.profileImg} />
          )}
          
          <Text style={styles.label}>Nome</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={student.name}
              editable={false}
            />
          </View>
          
          <Text style={styles.label}>CEP</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={String(student.zipcode)}
              editable={false}
            />
          </View>
          
          <View style={styles.inputsRow}>
            <View>
              <Text style={styles.label}>UF</Text>
              <View style={styles.uf}>
                <TextInput
                  style={styles.textInput}
                  value={student.state}
                  editable={false}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Cidade</Text>
              <View style={styles.city}>
                <TextInput
                  style={styles.textInput}
                  value={student.city}
                  editable={false}
                />
              </View>
            </View>
          </View>
          
          <Text style={styles.label}>Bairro</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={student.neighborhood}
              editable={false}
            />
          </View>
          
          <View style={styles.inputsRow}>
            <View>
              <Text style={styles.label}>Rua</Text>
              <View style={styles.street}>
                <TextInput
                  style={styles.textInput}
                  value={student.street}
                  editable={false}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Número</Text>
              <View style={styles.number}>
                <TextInput
                  style={styles.textInput}
                  value={String(student.number)}
                  editable={false}
                />
              </View>
            </View>
          </View>
          
          <Text style={styles.label}>Complemento</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={student.complement || ''}
              editable={false}
            />
          </View>
          
          <View style={styles.footer} />

          {modalVisible && (
            <View style={styles.modalState}>
              <View style={styles.close}>
                <FontAwesome 
                  name="bars" 
                  size={30} color="#3CB371" 
                  onPress={() => setModalVisible(visible => !visible)}
                />
              </View>
              
              <View style={styles.modal}>
                <RectButton style={styles.buttonOption} onPress={handleEdit}>
                  <Text style={styles.textOption}>Editar</Text>
                  <FontAwesome name="edit" size={30} color="#ffc721" /> 
                </RectButton>
                <RectButton style={styles.buttonOption} onPress={handleDeleteConfirm  }>
                  <Text style={styles.textOption}>Excluir</Text>
                  <FontAwesome name="times" size={30} color="#ff3535" /> 
                </RectButton>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalState: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  close: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modal: {
    alignSelf: 'flex-end',
    marginTop: 10,
    width: 150,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0,
  },
  buttonOption: {
    width: 150,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 1
  },
  textOption: {
    fontSize: 20,
    color: '#333',
  },
  profileImg: {
    height: 150,
    width: 150,
    margin: 20,
    alignSelf: 'center',
    borderRadius: 500,
    backgroundColor: '#eee'
  },
  label: {
    marginBottom: 8,
    marginTop: 15,
    marginHorizontal: 15,
    fontSize: 13,
    color: '#2E8B57',
  },
  input: {
    marginHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  textInput: {
    marginHorizontal: 10,
    height: 40,
    minWidth: 80
  },
  inputsRow: {
    flexDirection: 'row',
  },
  uf: {
    width: 45,
    marginHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  city: {
    width: Dimensions.get('window').width - 77,
    marginHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  street: {
    width: Dimensions.get('window').width - 112,
    marginHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  number: {
    width: 80,
    marginHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  footer: {
    height: 20,
  }
});