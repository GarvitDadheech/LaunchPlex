import InputBox from "./InputBox";

const TokenCard = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
                <InputBox heading="Token Name" placeholder="Enter the name of your token"/>
                <InputBox heading="Token Symbol" placeholder="Enter the symbol of your token"/>
                <InputBox heading="Decimal" placeholder="Enter the decimals you want in the token"/>
                <InputBox heading="Token Image" placeholder="Enter the uri link of token image"/>
            </div>
            <div className="flex gap-3">
                <button>Preview Token</button>
                <button>Launch Token</button>
            </div>
        </div>
    )
}

export default TokenCard;