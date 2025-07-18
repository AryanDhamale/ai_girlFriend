
function ErrorCon({text}:{text:string})
{
    return (
        <div className="w-full min-h-[83vh] flex items-center justify-center">
            <h1 className="text-lg text-red-500 drop-shadow-lg tracking-wide">{text}</h1>
        </div>
    );
}

export default ErrorCon;