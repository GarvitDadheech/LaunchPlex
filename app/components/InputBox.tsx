interface InputBoxProps {
    heading: string;
    placeholder: string;
}

const InputBox = ({heading,placeholder} : InputBoxProps) => {
    return (
        <div>
            <label>
                <div>{heading}</div>
                <input type="text" placeholder={placeholder}/>
            </label>
        </div>
    )
}

export default InputBox;