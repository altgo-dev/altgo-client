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
      backgroundColor: '#620042',
      height:  500,
      width: win.width
  },
  panel: {
    flex: 1,
    backgroundColor: '#620042',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#620042',
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
      backgroundColor: '#620042',
  },
  ml5: {
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      backgroundColor: '#620042',
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
  }, 
  inputCenter: {
    width: win.width -80,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10
  },
  collapMenu: {
    marginBottom: 5,
    // marginTop: 5,
    // borderBottomColor: 'lightgrey',
    // borderBottomWidth: 1,
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
  }
});

export default s