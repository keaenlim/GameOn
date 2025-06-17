import { Image, useColorScheme } from 'react-native'

// images
import DarkLogo from '../assets/img/logo.png'
import LightLogo from '../assets/img/logo.png'

const ThemedLogo = () => {
  const colorScheme = useColorScheme()
  
  const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

  return (
    <Image source={logo} />
  )
}

export default ThemedLogo