import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import {
  View,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";
import { FontAwesome } from "@expo/vector-icons";
import UserChat from "../components/UserChat";
import GroupChat from "../components/GroupChat";

const HomeScreen = () => {
  const navigation = useNavigation();

  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Hàm tải lại danh sách nhóm
      fetchGroups();
      acceptedFriendsList();
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ paddingLeft: 15 }}>
          <FontAwesome
            name="user-circle"
            size={27}
            color="black"
            onPress={() => navigation.navigate("ProfileScreen")}
          />
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            width: 130,
            height: "100%",
            paddingRight: 5,
          }}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <FontAwesome
              name="group"
              size={27}
              color="black"
              onPress={handleCreateGroup}
            />
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons
              onPress={() => navigation.navigate("Chats")}
              name="chatbox-ellipses-outline"
              size={27}
              color="black"
            />
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MaterialIcons
              onPress={() => navigation.navigate("Friends")}
              name="people-outline"
              size={30}
              color="black"
            />
          </View>
        </View>
      ),
    });
  }, []);

  const handleCreateGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const response = await axios.get(`http://localhost:8000/users/${userId}`);
      const usersData = response.data;
      setUsers(usersData);

      navigation.navigate("CreateGroup", {
        users: usersData,
        userId: userId,
      });
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };
  const handleToListGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const response = await axios.get(`http://localhost:8000/users/${userId}`);
      const usersData = response.data;
      setUsers(usersData);

      navigation.navigate("ListGroupChat", {
        users: usersData,
        userId: userId,
      });
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);

          console.log("users[] :", users);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  // ------------------------------------------------------------

  const [acceptedFriends, setAcceptedFriends] = useState([]);
  // const { userId, setUserId } = useContext(UserType);

  const [groups, setGroups] = useState([]);
  const fetchGroups = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
    try {
      // Replace 'userId' with the actual ID of the logged-in user
      // const userId = userId; // You should retrieve the actual userId from your authentication system
      const response = await fetch(`http://localhost:8000/groups/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      // Handle error
    }
  };

  const acceptedFriendsList = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
    try {
      const response = await fetch(
        `http://localhost:8000/accepted-friends/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setAcceptedFriends(data);
      }
    } catch (error) {
      console.log("error showing the accepted friends", error);
    }
  };

  // const navigation = useNavigation();
  useEffect(() => {
    console.log("userId :", userId);  
    acceptedFriendsList();
    fetchGroups();
  }, []);
  console.log("friends", acceptedFriends);

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
          {acceptedFriends.map((item, index) => (
            <UserChat key={index} item={item} />
          ))}
          {groups.map((item, index) => (
            <GroupChat key={index} item={item} />
          ))}
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
