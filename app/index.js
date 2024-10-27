import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import car from '../assets/images/house6.png'; // Assuming this image is still present

const Controls = ({ updateStatus }) => {
  const [batteryCharging, setBatteryCharging] = useState(true);
  const [solarPower, setSolarPower] = useState(100);
  const [powerConnected, setPowerConnected] = useState(true);
  const [usage, setUsage] = useState(10);
  const toggleBattery = () => {
    setBatteryCharging(!batteryCharging);
    updateStatus(
      batteryCharging ? 'Battery is not charging.' : 'Battery is charging.',
      batteryCharging ? '#e82127' : '#32CD32', // Red for not charging, green for charging
      batteryCharging ? 'battery' : 'battery-charging'
    );
  };
  
  const changeSolarPower = () => {
    const newPower = solarPower >= 100 ? 50 : solarPower + 25;
    setSolarPower(newPower);
  
    let color;
    if (newPower === 100) color = '#32CD32'; // Green for 100%
    else if (newPower === 75) color = '#FFD700'; // Yellow for 75%
    else color = '#FFA500'; // Orange for 50%
  
    updateStatus(`Solar power is at ${newPower}% efficiency.`, color, 'white-balance-sunny');
  };
  
  const togglePower = () => {
    setPowerConnected(!powerConnected);
    updateStatus(
      powerConnected ? 'Power connection lost.' : 'Power connection stable.',
      powerConnected ? '#e82127' : '#32CD32', // Red for disconnected, green for connected
      'power-plug'
    );
  };
  
  const increaseUsage = () => {
    const newUsage = usage >= 100 ? 10 : usage + 10;
    setUsage(newUsage);
  
    let color;
    if (newUsage < 50) color = '#32CD32'; // Green for low usage
    else if (newUsage < 80) color = '#FFD700'; // Yellow for moderate usage
    else color = '#FFA500'; // Orange for high usage
  
    updateStatus(`Energy usage increased to ${newUsage}%.`, color, 'gauge');
  };
  
  return (
    <View style={styles.controls}>
      <TouchableOpacity style={styles.controlButton} onPress={toggleBattery}>
        <MaterialCommunityIcons
          name={batteryCharging ? "battery-charging" : "battery"}
          size={26}
          color={batteryCharging ? "#e82127" : "gray"}
        />
        <Text style={[styles.controlText, { color: batteryCharging ? "#e82127" : "#32CD32" }]}>
  Battery
</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={changeSolarPower}>
        <FontAwesome name="sun-o" size={26} color="#e82127" />
        <Text style={styles.controlText}>Solar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={togglePower}>
        <MaterialCommunityIcons
          name="power-plug"
          size={26}
          color={powerConnected ? "#e82127" : "gray"}
        />
        <Text style={[styles.controlText, { color: powerConnected ? "#e82127" : "gray" }]}>
          Power
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={increaseUsage}>
        <Entypo name="gauge" size={26} color="#e82127" />
        <Text style={styles.controlText}>Usage</Text>
      </TouchableOpacity>
    </View>
  );
};
export default function Page() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Energy Flow: Normal');
  const [statusColor, setStatusColor] = useState('#e82127');
  const [statusIcon, setStatusIcon] = useState('bolt');
  const [weather, setWeather] = useState(null);
  const [electricityData, setElectricityData] = useState(null);

  const updateStatus = (message, color, icon) => {
    setStatusMessage(message);
    setStatusColor(color);
    setStatusIcon(icon);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Palo%20Alto&units=metric&appid=cc1be462f9870d5af9ac05a8ca4b96fe`
        );
        const data = await response.json();
        
        if (response.ok) {
          setWeather({
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
          });
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Updated electricity data fetching function
  const fetchElectricityPriceNREL = async () => {
    try {
        const response = await fetch(
            `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=Mi9dmNbf8hj6OazSC6dcczRg110qN37y9F944hcE&address=3500%20Deer%20Creek%20Rd,%20Palo%20Alto,%20CA`
        );
        const data = await response.json();

        if (data && data.outputs) {
            const latestPrice = data.outputs.residential;
            const utilityName = data.outputs.utility_name;
            setElectricityData({
                price: latestPrice,
                utility: utilityName,
            });
        } else {
            console.error('Error fetching electricity price data:', data.error || 'Unexpected response structure');
        }
    } catch (error) {
        console.error('Error fetching electricity price data:', error);
    }
  };


    fetchWeather();
    fetchElectricityPriceNREL(); // Call the function correctly
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Powerwall Status</Text>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons name={statusIcon} size={18} color={statusColor} style={styles.statusIcon} />
            <Text style={[styles.subtitle, { color: statusColor }]}>{statusMessage}</Text>
          </View>
        </View>
        <FontAwesome name="user-circle" size={30} color="#e82127" />
      </View>
      <View style={styles.weatherContainer}>
        {weather ? (
          <View style={styles.weatherInfo}>
            <Image
              style={styles.weatherIcon}
              source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
            />
            <View>
              <Text style={styles.weatherText}>
                {`Palo Alto: ${weather.temp}°C`}
              </Text>
              <Text style={styles.weatherDescription}>
                {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.weatherLoadingText}>Loading weather data...</Text>
        )}
      </View>

      <View style={styles.electricityContainer}>
        {electricityData ? (
          <View style={styles.electricityInfo}>
            <Text style={styles.electricityText}>
              {`Electricity Rate: $${electricityData.price.toFixed(2)} per kWh`}
            </Text>
            <Text style={styles.electricityLocation}>
              {`Utility: ${electricityData.utility}`}
            </Text>
            <Text style={styles.electricityDescription}>
              {`Location: Palo Alto, CA`}
            </Text>
          </View>
        ) : (
          <Text style={styles.electricityLoadingText}>Loading electricity price data...</Text>
        )}
      </View>


      <Image source={car} style={styles.image} resizeMode="contain" />

      {/* Render the controls */}
      <Controls updateStatus={updateStatus} />

      {/* Button to navigate to the second page */}
      <TouchableOpacity style={styles.navigateButton} onPress={() => router.push('/second')}>
        <Text style={styles.buttonText}>Get AI Analytics</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#161818',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    color: '#eee',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adds a gap between the title and status text
  },
  statusIcon: {
    marginRight: 6,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  weatherContainer: {
    marginTop: 10, // Space below the status text for weather data
    marginBottom: 20,
  },
  weatherText: {
    color: '#eee',
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10, // Reduce vertical margin to pull the image closer
    marginTop: -5, // Use negative margin to bring the image closer to the section above
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
  },
  controlText: {
    color: '#eee',
    fontSize: 12,
    marginTop: 5,
  },
  navigateButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: '#e82127',
    borderRadius: 25,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  weatherContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'flex-start', // Aligns the content to the left
    justifyContent: 'flex-start', // Aligns the content to the start
    paddingHorizontal: 16,
},
weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
},

  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  weatherText: {
    color: '#eee',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherDescription: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
  weatherLoadingText: {
    color: '#eee',
    fontSize: 16,
    fontStyle: 'italic',
  },
  electricityContainer: {
    marginTop: 10,
    marginBottom: 0, // Set margin to 0 to eliminate extra space
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
},


  electricityInfo: {
      flexDirection: 'column',
      alignItems: 'flex-start',
  },
  electricityText: {
      color: '#eee',
      fontSize: 18,
      fontWeight: 'bold',
  },
  electricityLocation: {
      color: '#ccc',
      fontSize: 16,
      fontStyle: 'italic',
  },
  electricityDescription: {
      color: '#aaa',
      fontSize: 14,
      fontStyle: 'italic',
  },
  electricityLoadingText: {
      color: '#eee',
      fontSize: 16,
      fontStyle: 'italic',
  },
});
