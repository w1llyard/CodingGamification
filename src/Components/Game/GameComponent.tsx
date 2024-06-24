import React, { useEffect } from 'react'
import * as Phaser from 'phaser'

interface GameComponentProps {
  config: Phaser.Types.Core.GameConfig
}

const GameComponent: React.FC<GameComponentProps> = ({ config }) => {
  useEffect(() => {
    // Ensure Phaser is only run on the client side
    if (typeof window !== 'undefined') {
      const game = new Phaser.Game(config)

      return () => {
        game.destroy(true)
      }
    }
  }, [config])

  return <div>
    <div id="phaser-container" />

  </div>
}
export default GameComponent
