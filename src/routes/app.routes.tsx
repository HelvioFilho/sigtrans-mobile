import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Home } from "@/screens/Home";
import { Search } from "@/screens/Search";
import { New } from "@/screens/New";
import { Document } from "@/screens/Document";

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
        name="Document"
        component={Document}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Screen
        name="New"
        component={New}
        options={{
          tabBarLabel: "Novo",
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign
              name={focused ? "pluscircle" : "pluscircleo"}
              color={color}
              size={size}
            />
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
