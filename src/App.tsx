import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import OBSWebSocket from 'obs-websocket-js';
import AudioInput from './components/AudioInput';
import Scene from './components/Scene';
import styled from 'styled-components';
import Cookies from 'js-cookie';
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`

const CategoryHeader = styled.h1`
color: white;
font-size: 24px;
font-weight: bold;
font-family: 'Swansea';

`

let obs: OBSWebSocket = new OBSWebSocket()
function App() {
  const [scenes, setScenes] = useState<string[]>([])
  const [currentScene, setCurrentScene] = useState<string>('')
  const [audioTracks, setAudioTracks] = useState<string[]>([])
  const urlInput = useRef<HTMLInputElement>(null) 

  useEffect(() => {
    return () => {
      if (obs.identified)
        obs.disconnect()
    }
  }, [])

  async function generateSceneButtons() {
    if (!obs.identified) return;
    const scenes = await obs.call('GetSceneList')
    setCurrentScene(scenes.currentProgramSceneName)
    setScenes(scenes.scenes.map((scene: any) => scene.sceneName))
  }

  async function generateAudioNames() {
    if (!obs.identified) return;
    const tracks = await obs.call('GetSpecialInputs').catch((e) => console.log(e))

    if (typeof tracks !== 'object') return;

    const trackNames = []
    for (let input of Object.values(tracks)) {
      if (input != null) trackNames.push(input)
    }
    setAudioTracks(trackNames)
  }



  let connectURL = ''
  return (
    <div className="App" style={{ backgroundColor: '#30336b', height: '100vh' }}>

      {!obs.identified && <div>
        <input type="text" placeholder="Enter OBS URL" ref={urlInput} defaultValue={Cookies.get('obsURL')}/>
        <button onClick={async () => {
          if(urlInput.current == null || urlInput.current.value === undefined || urlInput.current.value === '') return;
          Cookies.set('obsURL', urlInput.current.value)
          await obs.connect( urlInput.current.value, 'pZHEjHnHmHK2y7gm')
          await generateSceneButtons()
          await generateAudioNames()
        }}>Connect</button>
      </div>}
      {obs.identified && <div>
        <CategoryHeader>Scenes</CategoryHeader>
        <ButtonDiv>
          {scenes.map((scene: string) => {
            return <Scene obs={obs} name={scene} current={currentScene} />
          })}
        </ButtonDiv>
        <CategoryHeader>Audio Inputs</CategoryHeader>
        <ButtonDiv style={{flexDirection: 'column'}}>
          {audioTracks.map((track: string) => {
            return <AudioInput obs={obs} name={track} />
          })}
        </ButtonDiv>
      </div>}
    </div>
  );
}

export default App;
