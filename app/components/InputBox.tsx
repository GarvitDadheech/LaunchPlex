interface InputBoxProps {
    heading: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const InputBox = ({ heading, placeholder, value, onChange }: InputBoxProps) => {
    return (
        <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">
            <div>{heading}</div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
            </label>
        </div>
    );
};

export default InputBox