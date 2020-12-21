import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';

import Colors from '../constants/Colors';
import { Text, View } from './Themed';

export default function EditScreenInfo({ path }: { path: string }) {
  const [text, setText] = useState('')
  const [tab, setTab] = useState<Array<String>>([])

  useEffect(() => {
    async function getMessages() {
      try {
        const response = await axios.post('https://dev.beprowd.fr/webchat-history', {
          "auth":"53616c7465645f5f30c3fbcab5721e791de5c170251741079bc752ffed341158bbbfa3a8d3e413f32519ab3bdd2d9e73e3d8d9310094281d2aa23537720c3d8dbfcb7d59be889f82e8ccae57e8e7b0af",
          "conversation_id":"114548-4542457-142424-123341-webchat",
          "type":"get",
          "lookback":"2020-12-19T19:37:28.622Z"
        })

        setTab([...tab, ...response.data.map(e => (e.type === 'user_message' ? e.message : e.message[0].content))])
      } catch (err) {
        console.log(err);
      }
    }
    getMessages();
  }, []);

  const handleClick = useCallback(async () => {
    try {
       console.log(text)
      const response = await axios.post('https://dev.beprowd.fr/webchat-connector', {
        "auth":"53616c7465645f5f30c3fbcab5721e791de5c170251741079bc752ffed341158bbbfa3a8d3e413f32519ab3bdd2d9e73e3d8d9310094281d2aa23537720c3d8dbfcb7d59be889f82e8ccae57e8e7b0af",
        "conversation_id":"114548-4542457-142424-123341-webchat",
        text
      });
      setTab([...tab, text, response.data[0].content]);
      setText('');
    } catch (err) {
      console.log(err);
    }
    
  }, [text]);

  return (
    <KeyboardAwareScrollView
    scrollEnabled={true}
    >
      <ScrollView style={styles.chatBox}>
        {
          tab.map((data, i) => {
            return (
                <Text key={i}>{ data }</Text>
            )
          })
        }
      </ScrollView>

      <View style={styles.send}>
        <TextInput style={styles.input} value={text} onChangeText={(value) => setText(value)} />
        <TouchableOpacity onPress={handleClick} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            send 
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
 
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  send: {
    flex: 1,
    position: 'relative',
    bottom:0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxHeight: 50,
    minWidth:400,
   
    textAlign: 'center',
    
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: "black",
    padding: 8,
    margin: 10,
    alignSelf: 'stretch',
    maxHeight: 50,
    
  },
  helpLink: {
    paddingVertical: 15,
    marginRight: 10,
  
  },
  chatBox: {
    
    alignSelf: 'stretch',
    height:300,
    
    borderWidth:2,
    borderColor:"black"
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
