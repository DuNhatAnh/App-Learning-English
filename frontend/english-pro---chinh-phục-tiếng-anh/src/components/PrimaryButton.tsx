
import React from 'react';

interface PrimaryButtonProps {
    label: string;
    onClick: () => void;
    icon?: string;
    variant?: 'primary' | 'outline' | 'secondary';
    className?: string;
    fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    onClick,
    icon,
    variant = 'primary',
    className = '',
    fullWidth = false
}) => {
    const baseStyles = "flex items-center justify-center gap-2 h-12 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-sm";

    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark",
        outline: "bg-white border-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary",
        secondary: "bg-secondary text-primary hover:bg-blue-100 border border-blue-100"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : 'px-8'} ${className}`}>
            {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
            <span>{label}</span>
            {variant === 'primary' && !icon && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
        </button>
    );
};

export default PrimaryButton;
