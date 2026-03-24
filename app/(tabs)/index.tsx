import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Planner</Text>
      <Text style={styles.body}>Replace this screen with your meal planning dashboard.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#11181C',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#687076',
  },
});
