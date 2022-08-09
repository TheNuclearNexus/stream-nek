import OBSWebSocket from 'obs-websocket-js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SquareButton from './SquareButton'




interface SceneProps {
    obs: OBSWebSocket,
    name: string,
    current: string
}

function Scene({obs, name, current}: SceneProps) {
    const [active, setActive] = useState<boolean>(name === current)
    const [transitioning, setTransitioning] = useState<boolean>(false)

    obs.on('CurrentProgramSceneChanged', (scene) => {
        console.log(scene)
        setActive(scene.sceneName === name)
        setTransitioning(false)
    })

    return <SquareButton style={{backgroundImage: 
        !active ? 
            !transitioning ? 'linear-gradient(#ff7979, #eb4d4b)' : 'linear-gradient(#f6e58d, #f9ca24)' 
            : ''}} onClick={async () => {
        await obs.call('SetCurrentProgramScene', {sceneName: name})
        setTransitioning(true)
    }}>
        {name}
    </SquareButton>
}

export default Scene