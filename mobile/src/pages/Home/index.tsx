import React , { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { 
  View,
 ImageBackground, 
  Image,
  StyleSheet,
  Text
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PickerSelect {
  label: string;
  value: string;
}

const Home = () => {

  const navigation = useNavigation();

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const [ufsList, setUfsList] = useState<PickerSelect[]>([]);
  const [citiesList, setCitiesList] = useState<PickerSelect[]>([]);


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => {
        return{
          label: uf.sigla,
          value: uf.sigla
        };
      });
      setUfsList(ufInitials);
    });
  }, []);

  useEffect(() => {

    if (uf === '0'){
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
      const cityInitials = response.data.map(city => {
        return{
          label: city.nome,
          value: city.nome
        };
      });
      setCitiesList(cityInitials);
    });
  }, [uf]);

  function handleNavigateToPoints(){
    navigation.navigate('Points',{
      uf,
      city
    });
  }

  function hanldeSelectedUf(uf: string) {
    setUf(uf);
    setCity('');
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368}}
    >
      <View style={styles.main} >
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resísudos</Text> 
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma  eficiente</Text>
      </View>


      <View style={styles.footer}>


      <RNPickerSelect 
        placeholder={{
          label: 'Selecione um Estado',
          value: null,
          color: '#9ea0a4',
        }}
        onValueChange={value => hanldeSelectedUf(value)}
        items={ufsList}
        value={uf}
        style={pickerStyle}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Icon name="chevron-down" size={24} color="#c9c9c9" style={{top: 20, right: 10}} />;
        }}
      />

      <RNPickerSelect 
        placeholder={{
          label: 'Selecione uma cidade',
          value: null,
          color: '#9ea0a4',
        }}
        onValueChange={value => setCity(value)}
        items={citiesList}
        style={pickerStyle}

        value={city}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Icon name="chevron-down" size={24} color="#c9c9c9" style={{top: 20, right: 10}} />;
        }}
      />
          

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
             </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>  
        </RectButton>
      </View>

    </ImageBackground>
    
  );
};

const pickerStyle = {
	inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;