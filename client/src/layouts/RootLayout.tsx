import {Toaster} from "@/components/ui/toaster"
import {Link, Outlet, ScrollRestoration} from "react-router-dom"
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown, Menu, Moon, Sun} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {themes, useTheme} from "@/hooks/useTheme.ts";

export function RootLayout() {

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <nav className="sticky top-0 z-10 border-b p-4 bg-white dark:bg-slate-950">
                    <div className="container flex items-center justify-between gap-4">
                        <div className="text-lg font-bold  capitalize">Jobify</div>
                        <div className='flex'>
                            <ThemeToggle/>
                            <div className=" justify-around hidden sm:flex ">
                                <NavItem to='/tasks'>Task Board</NavItem>
                                <NavItem to='/jobs '>Job Listings</NavItem>
                                {
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
                                            >
                                                <span>hello world</span>
                                                <ChevronDown className="w-4 h-4 ml-2"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link to='/jobs/mylistings'
                                                      className="text-slate-900 cursor-pointer dark:text-slate-50 font-medium text-md hover:text-slate-800 dark:hover:text-slate-100">My
                                                    listings</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to='/logout'
                                                      className="text-slate-900 cursor-pointer dark:text-slate-50 font-medium text-md hover:text-slate-800 dark:hover:text-slate-100">Log
                                                    out</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex sm:hidden' asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
                                    >
                                        <Menu className="h-5 w-5"/>
                                        <span className="sr-only">Toggle Theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link to='/tasks'
                                              className="text-slate-900 cursor-pointer dark:text-slate-50 font-medium text-md hover:text-slate-800 dark:hover:text-slate-100">Task
                                            Board</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to='/jobs'
                                              className="text-slate-900 cursor-pointer dark:text-slate-50 font-medium text-md hover:text-slate-800 dark:hover:text-slate-100">Job
                                            board</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="flex w-full items-center">
                                                    <span>More</span>
                                                    {/*<ChevronDown className="w-4 h-4 ml-2"/>*/}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent
                                                >
                                                    <DropdownMenuItem className="DropdownMenuItem">
                                                        Save Page As… <div className="RightSlot">⌘+S</div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </nav>

                <div className="container my-4 flex-grow grid grid-cols-1">
                    <div>
                        <Outlet/>
                    </div>
                </div>
            </div>
            <ScrollRestoration/>
            <Toaster/>
        </>
    )
}

const ThemeToggle = () => {
    const {theme, toggleTheme} = useTheme()
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
            >
                <Sun className="h-5 w-5 scale-100 dark:scale-0 transition-transform"/>
                <Moon className="absolute h-5 w-5 scale-0 dark:scale-100 transition-transform"/>
                <span className="sr-only">Toggle Theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {
                themes.map(item => (
                    <DropdownMenuItem key={item} onSelect={() => toggleTheme(item)}
                                      className={`${item === theme && 'bg-slate-100 dark:!bg-slate-800'}`}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </DropdownMenuItem>
                ))
            }
        </DropdownMenuContent>
    </DropdownMenu>
}

const NavItem = ({to, children}: { to: string, children: string }) => (
    <Button variant='ghost' asChild>
        <Link to={to}>{children}</Link>
    </Button>
)