import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="recipe" />
      <Stack.Screen name="post" />
      <Stack.Screen name="video" />
      <Stack.Screen name="short" />
    </Stack>
  );
}