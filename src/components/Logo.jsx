export default function Logo({ size = 'md', light = false }) {
  const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }
  const color = light ? 'text-white' : 'text-[#1B3A6B]'
  const dotSize = size === 'lg' ? 10 : size === 'md' ? 8 : 6
  return (
    <span className={`font-extrabold ${sizes[size]} ${color} tracking-tight`} style={{ fontFamily: 'Sora, sans-serif' }}>
      FinConf
      <span className="relative inline-block leading-none mx-[1px]">
        i
        <span
          className="absolute left-1/2 bg-[#F5A623]"
          style={{
            width: dotSize,
            height: dotSize,
            transform: 'translateX(-50%) rotate(45deg)',
            top: size === 'lg' ? -6 : size === 'md' ? -5 : -4
          }}
        />
      </span>
      a
    </span>
  )
}
