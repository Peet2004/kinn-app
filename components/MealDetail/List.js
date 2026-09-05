import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default function List({ data }) {
  return data.map((dataPoint, index) => (
    <View key={dataPoint + index} style={styles.listItem}>
      <View style={styles.bullet} />
      <Text style={styles.itemText}>{dataPoint}</Text>
    </View>
  ));
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary400,
    marginTop: 7,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    color: Colors.text700,
    fontSize: 14,
    lineHeight: 20,
  },
});
