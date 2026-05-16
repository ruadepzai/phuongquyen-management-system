export default function Logo({ size = 32, color = "currentColor", style }) {
  return (
    <svg 
      width={size} 
      height={size} 
      style={style} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Nắp đậy thức ăn (Cloche) thể hiện nhà hàng cao cấp */}
      <path d="M12 2v2" />
      <path d="M9 2h6" />
      <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      <path d="M2 14h20" />
      <path d="M2 17h20v2H2z" />
      
      {/* Ngôi sao lấp lánh (Premium) */}
      <path d="M12 7l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill={color} />
    </svg>
  )
}
