import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default function Subtitle({ children }) {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitle}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitleContainer: {
    paddingBottom: 8,
    marginBottom: 4,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  subtitle: {
    color: Colors.text900,
    fontSize: 15,
    fontWeight: '700',
  },
});
