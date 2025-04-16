import { Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* HomeScreen */}
      <Stack.Screen name="(tabs)" /> {/* Your tab navigation */}
      <Stack.Screen 
        name="(pages)/tracking" 
        options={{
          presentation: 'modal', // Optional: makes it slide up from bottom
          headerShown: true, // Show header for this screen only
          headerTitle: 'Bus Tracking', // Custom title
          headerTintColor: '#fff', // White back button/text
          headerStyle: {
            backgroundColor: '#2b2b2b', // Same dark background
          },
        }}
      />
    </Stack>
  );
}