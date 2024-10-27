import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SecondPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Second Page</Text>
        <Text style={styles.subtitle}>This is the second page of your app.</Text>
        {/* Use router.back() instead of Link */}
        <Pressable style={styles.link} onPress={() => router.back()}>
          <Text style={styles.linkText}>Go Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#38434D",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 18,
    color: "blue",
  },
});
