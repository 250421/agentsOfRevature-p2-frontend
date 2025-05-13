interface GameHeaderProps {
    title: string,
}

export function GameHeader({ title }: GameHeaderProps) {
    return (
        <div className="text-center pb-5 mb-5 border-b">
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    )
}