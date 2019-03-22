import { StyleSheet, Dimensions } from 'react-native';
const win = Dimensions.get('window');

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLoc: {
      flex: 3,
      backgroundColor: '#5e0f2c',
      minHeight: win.height/6,
    //   hei

  }
});

export default s