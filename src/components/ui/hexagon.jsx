import React from "react";
import { cn } from "@/lib/utils";

/**
 * HexAvatar - Hexagonal Avatar Component
 * Uses clip-path for perfect hexagonal shape with border
 */
export function HexAvatar({ 
  src, 
  alt = "", 
  fallback,
  size = "md",
  borderColor = "primary",
  online = false,
  className,
  ...props 
}) {
  const sizes = {
    sm: { outer: "w-12 h-14", inner: "w-11 h-13", text: "text-sm" },
    md: { outer: "w-20 h-24", inner: "w-[76px] h-[92px]", text: "text-xl" },
    lg: { outer: "w-28 h-32", inner: "w-[108px] h-[124px]", text: "text-2xl" },
    xl: { outer: "w-36 h-40", inner: "w-[140px] h-[156px]", text: "text-3xl" },
  };

  const borderColors = {
    primary: "from-[var(--primary)] to-orange-500",
    featured: "from-[var(--category-featured)] to-yellow-500",
    pros: "from-[var(--category-pros)] to-blue-500",
    schedules: "from-[var(--category-schedules)] to-green-500",
    messages: "from-[var(--category-messages)] to-purple-500",
    white: "from-white to-gray-200",
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      {/* Border layer */}
      <div 
        className={cn(
          "hexagon-pointy bg-gradient-to-br",
          borderColors[borderColor],
          sizeConfig.outer
        )}
      />
      
      {/* Inner content */}
      <div 
        className={cn(
          "absolute inset-[3px] hexagon-pointy overflow-hidden bg-[var(--surface)]",
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center bg-[var(--surface-secondary)] text-[var(--text-muted)] font-bold",
            sizeConfig.text
          )}>
            {fallback}
          </div>
        )}
      </div>
      
      {/* Online indicator */}
      {online && (
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--surface)] z-10" />
      )}
    </div>
  );
}

/**
 * HexButton - Hexagonal Button for Navigation/Actions
 * Perfect for honeycomb grid layouts
 */
export function HexButton({
  icon,
  label,
  active = false,
  borderColor = "primary",
  iconBgColor,
  onClick,
  className,
  size = "md",
  ...props
}) {
  const sizes = {
    sm: { hex: "w-20 h-24", icon: "w-8 h-8", text: "text-xs" },
    md: { hex: "w-28 h-32", icon: "w-10 h-10", text: "text-sm" },
    lg: { hex: "w-36 h-40", icon: "w-12 h-12", text: "text-base" },
  };

  const borderColors = {
    primary: "var(--primary)",
    featured: "var(--category-featured)",
    pros: "var(--category-pros)",
    schedules: "var(--category-schedules)",
    messages: "var(--category-messages)",
    market: "var(--category-market)",
    analytics: "var(--category-analytics)",
  };

  const sizeConfig = sizes[size] || sizes.md;
  const borderStyle = { borderColor: borderColors[borderColor] || borderColors.primary };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-200 group",
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {/* Hexagon Container */}
      <div 
        className={cn(
          "hexagon bg-[var(--surface)] border-2 flex flex-col items-center justify-center",
          sizeConfig.hex,
          active && "border-[var(--primary)]"
        )}
        style={!active ? borderStyle : undefined}
      >
        {/* Icon Circle */}
        <div 
          className={cn(
            "rounded-full flex items-center justify-center mb-2",
            sizeConfig.icon
          )}
          style={{ backgroundColor: iconBgColor || borderColors[borderColor] + '20' }}
        >
          <span style={{ color: borderColors[borderColor] }}>
            {icon}
          </span>
        </div>
        
        {/* Label */}
        <span className={cn(
          "font-semibold text-center text-[var(--text-primary)] leading-tight",
          sizeConfig.text
        )}>
          {label}
        </span>
      </div>
    </button>
  );
}

/**
 * HexStat - Hexagonal Stat Card for Dashboards
 * Displays KPIs with trend indicators and sparklines
 */
export function HexStat({
  icon,
  label,
  value,
  trend,
  trendValue,
  sparkline,
  className,
  ...props
}) {
  const trendColors = {
    up: "text-[var(--success)]",
    down: "text-[var(--error)]",
    neutral: "text-[var(--text-muted)]",
  };

  return (
    <div 
      className={cn(
        "relative w-full aspect-[1/1.15]",
        className
      )}
      {...props}
    >
      {/* Hexagon shape */}
      <div className="absolute inset-0 hexagon-pointy bg-[var(--surface-secondary)] shadow-lg" />
      
      {/* Content */}
      <div className="absolute inset-0 hexagon-pointy flex flex-col items-center justify-center p-4 text-center">
        {/* Icon */}
        {icon && (
          <div className="text-[var(--primary)] mb-1">
            {icon}
          </div>
        )}
        
        {/* Label */}
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        
        {/* Value */}
        <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
          {value}
        </p>
        
        {/* Trend */}
        {trend && (
          <div className={cn("flex items-center gap-1 mt-1", trendColors[trend])}>
            {trend === 'up' && <span className="text-xs">↗</span>}
            {trend === 'down' && <span className="text-xs">↘</span>}
            {trend === 'neutral' && <span className="text-xs">→</span>}
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
        
        {/* Sparkline placeholder */}
        {sparkline && (
          <div className="w-16 h-6 mt-2 opacity-50">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path 
                d="M0 25 C20 25 20 10 40 10 C60 10 60 20 80 15 C90 12 95 5 100 2" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-[var(--primary)]"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * HexGrid - Honeycomb Grid Layout
 * Arranges children in a staggered honeycomb pattern
 */
export function HexGrid({ children, columns = 2, className, ...props }) {
  const childArray = React.Children.toArray(children);
  const rows = [];
  
  for (let i = 0; i < childArray.length; i += columns) {
    rows.push(childArray.slice(i, i + columns));
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)} {...props}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex}
          className={cn(
            "flex justify-center gap-4",
            rowIndex % 2 === 1 && "ml-16" // Offset even rows for honeycomb effect
          )}
        >
          {row}
        </div>
      ))}
    </div>
  );
}

/**
 * HexPortfolio - Portfolio Image in Hexagon
 */
export function HexPortfolio({ src, alt = "", size = "md", className, ...props }) {
  const sizes = {
    sm: "w-20 h-24",
    md: "w-28 h-32",
    lg: "w-36 h-40",
  };

  return (
    <div 
      className={cn(
        "hexagon-pointy overflow-hidden bg-[var(--surface-secondary)]",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * HexPortfolioGrid - Honeycomb Mosaic for Portfolio
 */
export function HexPortfolioGrid({ images = [], className, ...props }) {
  // Split images into rows for honeycomb effect
  const topRow = images.slice(0, 3);
  const bottomRow = images.slice(3, 5);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)} {...props}>
      {/* Top row - 3 hexagons */}
      <div className="flex gap-2">
        {topRow.map((img, index) => (
          <HexPortfolio key={index} src={img} size="md" />
        ))}
        {/* Fill empty slots */}
        {Array(3 - topRow.length).fill(null).map((_, index) => (
          <HexPortfolio key={`empty-top-${index}`} size="md" />
        ))}
      </div>
      
      {/* Bottom row - 2 hexagons (nestled in gaps) */}
      <div className="flex gap-2 -mt-4">
        {bottomRow.map((img, index) => (
          <HexPortfolio key={index} src={img} size="md" />
        ))}
        {bottomRow.length < 2 && (
          <HexPortfolio size="md" />
        )}
      </div>
    </div>
  );
}

export default {
  HexAvatar,
  HexButton,
  HexStat,
  HexGrid,
  HexPortfolio,
  HexPortfolioGrid,
};