import React, { useEffect, useRef, useState } from 'react';
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
  const passwordInput = useRef<HTMLInputElement>(null)

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


  return (
    <div className="App" style={{ backgroundColor: '#30336b', height: '100vh' }}>

      {!obs.identified && <ButtonDiv style={{flexDirection: 'column', alignItems: 'center', height: '75%'}}>
        <input style={{width:196}} type="text" placeholder="Enter OBS URL" ref={urlInput} defaultValue={Cookies.get('obsURL')}/>
        <input style={{width:196}} type="password" placeholder="Enter OBS Password" ref={passwordInput} defaultValue={Cookies.get('obsPassword')}/>
        <button onClick={async () => {
          if(urlInput.current == null || urlInput.current.value === undefined || urlInput.current.value === '') return;
          console.log('click')
          if(passwordInput.current == null) return;

          Cookies.set('obsURL', urlInput.current.value)
          Cookies.set('obsPassword', passwordInput.current.value ?? '')

          await obs.connect( urlInput.current.value, passwordInput.current.value ?? '')
          await generateSceneButtons()
          await generateAudioNames()
        }}>Connect</button>
      </ButtonDiv>}
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
