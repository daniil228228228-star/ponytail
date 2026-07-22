import { useEffect, useState } from 'react'

interface AnimatedHeadingProps {
  text: string
  className?: string
  style?: React.CSSProperties
  initialDelay?: number
  charDelay?: number
  charDuration?: number
}

export default function AnimatedHeading({
  text,
  className = '',
  style,
  initialDelay = 200,
  charDelay = 30,
  charDuration = 500,
}: AnimatedHeadingProps) {
  const [started, setStarted] = useState(false)
  const lines = text.split('\n')

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const chars = line.split('')
        return (
          <span key={lineIndex} className="block">
            {chars.map((char, charIndex) => {
              const delay =
                lineIndex * chars.length * charDelay + charIndex * charDelay
              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: started ? 1 : 0,
                    transform: started ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: `${charDuration}ms`,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}
