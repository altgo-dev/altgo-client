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
      backgroundColor: '#A2CCCD',
      height:  500,
      width: win.width
  },
  panel: {
    flex: 1,
    backgroundColor: '#A2CCCD',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#A2CCCD',
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
      backgroundColor: '#A2CCCD',
      marginTop: 50
  },
  ml5: {
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      backgroundColor: '#A2CCCD',
      height: 40
  },
  textLight: {
    color: 'white',
  },
  searhBox: {
      width: win.width - win.width/3,
      borderColor: 'white',
      marginLeft: 40,
      borderBottomWidth: 3
  },
  inputEmailSearch: {
    width: win.width - 60,
    marginLeft: 10,
    height: 40
  }, 
  inputCenter: {
    width: win.width -80,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10
  },
  collapMenu: {
    marginBottom: 5,
    width: win.width,
    flex:1, 
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50
  },
  collapText: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center'
  },
  catImg: {
    flex: 1,
    width: win.width / 2 -10,
    margin: 5,
    height: win.height / 3 -30
  }
});

export default s