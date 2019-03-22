import { StyleSheet, Dimensions } from 'react-native';
const win = Dimensions.get('window');

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resList: {
      flex: 1,
      backgroundColor: 'black',
      height:  500,
      width: win.width
  },
  panel: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: 'grey',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  },
  searchHead: {
      backgroundColor: 'black',
  },
  ml5: {
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      backgroundColor: 'black',
      height: 40
  },
  textLight: {
    color: '#cccccc',
  },
  searhBox: {
      width: win.width - win.width/5
  },
  inputEmailSearch: {
    width: win.width - 60,
    marginLeft: 10,
    height: 40
  }
});

export default s