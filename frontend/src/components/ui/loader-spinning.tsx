import React from 'react'

interface SpinningProps extends React.SVGProps<SVGSVGElement> {
  color?: string
  size?: number | string
  className?: string
}

export const LoaderSpinning: React.FC<SpinningProps> = ({
  color = '#404040',
  size = 64,
  className = '',
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <radialGradient
      id="a10"
      cx=".66"
      fx=".66"
      cy=".3125"
      fy=".3125"
      gradientTransform="scale(1.5)"
    >
      <stop offset="0" stopColor={color}></stop>
      <stop offset=".3" stopColor={color} stopOpacity=".9"></stop>
      <stop offset=".6" stopColor={color} stopOpacity=".6"></stop>
      <stop offset=".8" stopColor={color} stopOpacity=".3"></stop>
      <stop offset="1" stopColor={color} stopOpacity="0"></stop>
    </radialGradient>
    <circle
      style={{ transformOrigin: 'center' }}
      fill="none"
      stroke="url(#a10)"
      strokeWidth="15"
      strokeLinecap="round"
      strokeDasharray="200 1000"
      strokeDashoffset="0"
      cx="100"
      cy="100"
      r="70"
    >
      <animateTransform
        type="rotate"
        attributeName="transform"
        calcMode="spline"
        dur="2s"
        values="360;0"
        keyTimes="0;1"
        keySplines="0 0 1 1"
        repeatCount="indefinite"
      />
    </circle>
    <circle
      style={{ transformOrigin: 'center' }}
      fill="none"
      opacity=".2"
      stroke={color}
      strokeWidth="15"
      strokeLinecap="round"
      cx="100"
      cy="100"
      r="70"
    />
  </svg>
)
