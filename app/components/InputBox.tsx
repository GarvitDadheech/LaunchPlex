interface InputBoxProps {
    heading: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}

const InputBox = ({ 
    heading, 
    placeholder, 
    value, 
    onChange,
    type = "text" 
}: InputBoxProps) => {
    return (
        <div className="group transform transition-all duration-300">
            <label className="block text-[16px] font-semibold text-blue-100/90 mb-2">
                {heading}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg
                          bg-black/40 border border-white/10
                          text-white placeholder:text-sm
                          focus:outline-none focus:ring-2 focus:ring-purple-500/50
                          transition-all duration-300
                          backdrop-blur-sm"
            />
        </div>
    );
};

export default InputBox;
