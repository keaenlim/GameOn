import { View } from 'react-native'
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/Colors'

const ThemedView = ({ style, ...props }) => {
  const { theme } = useTheme()
  const themeColors = Colors[theme] ?? Colors.light

  return (
    <View 
      style={[{ backgroundColor: themeColors.background }, style]}
      {...props}
    />
  )
}

export default ThemedView