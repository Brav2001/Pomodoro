import Constants from "expo-constants"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from "react";
import Header from "./src/components/Header";
import Timer from "./src/components/Timer";
import {Audio} from "expo-av";

const colors =["#F7DC6F","#A2D9CE","#D7DBE2"];

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25*60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "LONG");
  const [isActived, setIsACtived] = useState(false);

  const timers=[1500,300,900];

  useEffect(()=>{
    let interval= null;

    if(isActived){
      interval=setInterval(()=>{
        setTime(time-1);
      },1000)
    }else{
      clearInterval(interval);
    }

    if(time === 0){
      playSoundAlarm();
      setIsACtived(false);
      setIsWorking(!isWorking);
      setTime(timers[currentTime]);
    }

    return ()=>clearInterval(interval);
  },[isActived,time])

  function handleStartStop(){
    playSound().then(()=>setIsACtived(!isActived));
  }

  async function playSound(){
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/click.mp3")
    );

    await sound.playAsync();
  }

  async function playSoundAlarm(){
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/alarma.mp3")
    );

    await sound.playAsync();
  }

  return (
    <View style={[styles.container,{backgroundColor:colors[currentTime]}]}>
      <StatusBar style="dark" backgroundColor={colors[currentTime]} />
      <Text style={styles.text}>Pomodoro</Text>
      <Header currentTime={currentTime} setCurrentTime={setCurrentTime} setTime={setTime} setIsACtived={setIsACtived}/>
      <Timer time={time} />
      <TouchableOpacity onPress={handleStartStop} style={styles.button}>
        <Text style={{color:"white",fontWeight:'bold'}}>{isActived ? "STOP":"START"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:Constants.statusBarHeight,
    paddingHorizontal: 15,
    
  },
  text:{
    fontSize:32,
    fontWeight:'bold'
  },
  button:{
    alignItems:'center',
    backgroundColor:'#333333',
    padding:15,
    marginTop:15,
    borderRadius:15,
  }
});
