import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Home } from "@/screens/Home";
import { Search } from "@/screens/Search";

function TabNavigation() {
  const { Navigator, Screen } = createBottomTabNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "md-home-sharp" : "md-home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
    </Navigator>
  );
}

function StackNavigation() {
  const { Navigator, Screen } = createStackNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Main" component={TabNavigation} />
    </Navigator>
  );
}

export function AppRoutes() {
  return <StackNavigation />;
}
