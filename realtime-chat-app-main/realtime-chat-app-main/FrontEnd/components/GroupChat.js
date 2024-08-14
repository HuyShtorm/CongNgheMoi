import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { MaterialIcons } from "@expo/vector-icons";

const GroupChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    const groupId = item._id;
    try {
      const response = await fetch(
        `http://localhost:8000/group-messages/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  // console.log(lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("GroupChat", {
          groupId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
        justifyContent: "center",
        
        // đổ bóng
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {/* <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      /> */}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginHorizontal: "3%",
        }}
      >
        <MaterialIcons name="groups" size={30} color="blue" />
        <View style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: 10,
          
        
        }}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 10 }}>
            {item?.name}
          </Text>
          {lastMessage && (
            <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" ,marginLeft: 10}}>
              {lastMessage?.message}
            </Text>
          )}
        </View>
      </View>

      <View style={{ justifyContent: "center" }}>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default GroupChat;

const styles = StyleSheet.create({});
