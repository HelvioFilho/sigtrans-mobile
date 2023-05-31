import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Home } from "@/screens/Home";
import { Search } from "@/screens/Search";
import { Document } from "@/screens/Document";
import { FirstInformation } from "@/screens/newScreens/FirstInformation";
import { SecondInformation } from "@/screens/newScreens/SecondInformation";
import { Gallery } from "@/screens/newScreens/Gallery";
import { Review } from "@/screens/newScreens/Review";

function CreateDocuments() {
  const { Navigator, Screen } = createStackNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="First" component={FirstInformation} />
      <Screen name="Second" component={SecondInformation} />
      <Screen name="Gallery" component={Gallery} />
      <Screen name="Review" component={Review} />
    </Navigator>
  );
}

function TabNavigation() {
  const { Navigator, Screen } = createBottomTabNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 13,
        },
        tabBarLabelStyle: {
          fontFamily: "Roboto_400Regular",
          fontSize: 14,
        },
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Screen
        name="NewScreens"
        component={CreateDocuments}
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
      <Screen name="Document" component={Document} />
    </Navigator>
  );
}

export function AppRoutes() {
  return <StackNavigation />;
}
