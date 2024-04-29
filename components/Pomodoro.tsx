import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pomodoro = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [onBreak, setOnBreak] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [info, setInfo] = useState<string>('Focus time');
  const [currentClockIndex, setCurrentClockIndex] = useState<number>(0);
  const navigation = useNavigation();

  const clocks = [
    { type: 'Focus time', minutes: 25 },
    { type: 'Short Break', minutes: 5 },
    { type: 'Long Break', minutes: 15 }
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedSeconds(prevElapsedSeconds => prevElapsedSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    const { onBreak } = calculateSeconds(elapsedSeconds, clocks[currentClockIndex].minutes);
    setOnBreak(onBreak);
  }, [elapsedSeconds, currentClockIndex]);

  useEffect(() => {
    setInfo(onBreak ? 'Break time' : 'Focus time');
  }, [onBreak]);

  const calculateSeconds = (elapsedSeconds: number, totalSeconds: number) => {
    const remainingSeconds = totalSeconds * 60 - elapsedSeconds;
    const isBreak = remainingSeconds <= 0;
    return { remainingSeconds, onBreak: isBreak };
  };

  const convertHMS = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const startClock = () => {
    setIsRunning(true);
  };

  const stopClock = () => {
    setIsRunning(false);
  };

  const switchClock = (index: number) => {
    setCurrentClockIndex(index);
    setElapsedSeconds(0);
    setIsRunning(true);
    setOnBreak(false);
    setInfo(clocks[index].type);
  };

  const clock = convertHMS(clocks[currentClockIndex].minutes * 60 - elapsedSeconds);
  const totalSeconds = clocks[currentClockIndex].minutes * 60;
  const percentage = (100 / totalSeconds) * (totalSeconds - elapsedSeconds);

  return (
    <View style={styles.container}>
      <View style={styles.clockButtonsContainer}>
        {clocks.map((clock, index) => (
          <Pressable key={index} style={[styles.clockButton, currentClockIndex === index && styles.selectedClockButton]} onPress={() => switchClock(index)}>
            <Text>{clock.type}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.info}>{info}</Text>
      <Text style={styles.clock}>{clock}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: onBreak ? 'green' : (info === 'Focus time' ? 'red' : 'blue') }]} />
      </View>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Pressable style={styles.button} onPress={startClock}>
            <Text>Start</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={stopClock}>
            <Text>Stop</Text>
          </Pressable>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goHomeButton}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ead6',
  },
  info: {
    fontSize: 24,
    marginBottom: 10,
    color: '#654321',
  },
  clock: {
    fontSize: 36,
    marginBottom: 20,
    color: '#654321',
  },
  progressContainer: {
    width: '80%',
    backgroundColor: 'gray',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  goHomeButton: {
    backgroundColor: '#8b4513',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  clockButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  clockButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  selectedClockButton: {
    backgroundColor: '#8b4513',
  },
  clockButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default Pomodoro;
