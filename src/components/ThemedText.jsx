import { Text } from 'react-native'
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/Colors'

const ThemedText = ({ style, children, title = false, ...props }) => {
  const { theme } = useTheme()
  const themeColors = Colors[theme] ?? Colors.light

  const textColor = title ? themeColors.title : themeColors.text

  return (
    <Text 
      style={[{ color: textColor }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export default ThemedText