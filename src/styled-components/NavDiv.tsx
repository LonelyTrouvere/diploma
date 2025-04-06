

export default function NavDiv({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return <div className="w-full h-16 flex justify-start items-center shadow pl-3 py-1">
        {children}
    </div>
}