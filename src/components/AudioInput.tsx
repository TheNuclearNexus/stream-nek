import OBSWebSocket from 'obs-websocket-js'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SquareButton from './SquareButton'




interface AudioInputProps {
    obs: OBSWebSocket,
    name: string,
}


const VolumeSlider = styled.input`
    width: 196px;
    height: 4px;

    -webkit-appearance: none;
    appearance: none;
    background-color: white;
    border-radius: 16px;

    ::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 16px; /* Set a specific slider handle width */
        height: 8px; /* Slider handle height */
        border-radius: 8px;
        background: #6ab04c; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
    
`

function AudioInput({ obs, name }: AudioInputProps) {
    const [muted, setMuted] = useState<boolean>(true)
    const [volume, setVolume] = useState<number>(0)
    const volumeSlider = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (obs.identified) {
            obs.call('GetInputMute', { inputName: name }).then((response) => {
                setMuted(response.inputMuted)
            })
            obs.call('GetInputVolume', { inputName: name }).then((response) => {
                console.log(response)
                if(volumeSlider.current == null) return
                volumeSlider.current.value = response.inputVolumeDb.toString()
                setVolume(response.inputVolumeDb)
            })
        }

    }, [obs])

    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 16}}>
        <SquareButton style={{ backgroundImage: muted ? 'linear-gradient(#ff7979, #eb4d4b)' : '' }} onClick={() => {
            obs.call('SetInputMute', { inputName: name, inputMuted: !muted })
            setMuted(!muted)
        }}>
            {name}
        </SquareButton>
        <VolumeSlider type="range" min="-100" max="26" step="0.5" defaultValue={volume.toString()} ref={volumeSlider} onChange={(e) => { 
            obs.call('SetInputVolume', { inputName: name, inputVolumeDb: Number.parseFloat(e.currentTarget.value) }) 
            setVolume(Number.parseFloat(e.currentTarget.value))
        }} />
        <div style={{width: 32}}>
            <label style={{color: 'white', fontFamily: 'Swansea'}}>{volume.toFixed(1)}</label>

        </div>
    </div>
}

export default AudioInput