interface LandingProps {
  onStart: () => void;
}
export function Landing({ onStart }: LandingProps){        
    return (
        <div className="relative bg-gray-50">
    <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
        <img className="w-auto h-full" src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" alt="" />
    </div>

    <header className="relative py-4 md:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                    <a href="#" title="" className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                        <img className="w-auto h-8" src="https://d33wubrfki0l68.cloudfront.net/682a555ec15382f2c6e7457ca1ef48d8dbb179ac/f8cd3/images/logo.svg" alt="" />
                    </a>
                </div>

                <div className="flex lg:hidden">
                    <button type="button" className="text-gray-900">
                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                <div className="hidden lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10">
                    
                    <button
                        onClick = {onStart}
                        title=""
                        className="
                            px-5
                            py-2
                            text-base
                            font-semibold
                            leading-7
                            text-gray-900
                            transition-all
                            duration-200
                            bg-transparent
                            border border-gray-900
                            rounded-xl
                            font-pj
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                            hover:bg-gray-900 hover:text-white
                            focus:bg-gray-900 focus:text-white
                            cursor-pointer
                        "
                        role="button"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    </header>

    <section className="relative py-12 sm:py-16 lg:pt-20 lg:pb-36">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 sm:gap-y-20 xl:grid-cols-5">
                <div className="text-center xl:col-span-2 lg:text-left md:px-16 lg:px-0">
                    <div className="max-w-sm mx-auto sm:max-w-md md:max-w-full">
                        <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">The Modern Way to Create Interactive Forms✨</h1>

                        <div className="mt-8 lg:mt-12 lg:flex lg:items-center">
                            <div className="flex justify-center flex-shrink-0 -space-x-4 overflow-hidden lg:justify-start">
                                <img className="inline-block rounded-full w-14 h-14 ring-2 ring-white" src="https://d33wubrfki0l68.cloudfront.net/3bfa6da479d6b9188c58f2d9a8d33350290ee2ef/301f1/images/hero/3/avatar-male.png" alt="" />
                                <img className="inline-block rounded-full w-14 h-14 ring-2 ring-white" src="https://d33wubrfki0l68.cloudfront.net/b52fa09a115db3a80ceb2d52c275fadbf84cf8fc/7fd8a/images/hero/3/avatar-female-1.png" alt="" />
                                <img className="inline-block rounded-full w-14 h-14 ring-2 ring-white" src="https://d33wubrfki0l68.cloudfront.net/8a2efb13f103a5ae2909e244380d73087a9c2fc4/31ed6/images/hero/3/avatar-female-2.png" alt="" />
                            </div>

                            <p className="mt-4 text-lg text-gray-900 lg:mt-0 lg:ml-4 font-pj">Create your <span className="font-bold">Form Editor</span> and provide answer by drag and drop</p>
                        </div>
                    </div>

                </div>

                <div className="xl:col-span-3">
                    <img className="w-[600px] mx-auto scale-110" src="https://plus.unsplash.com/premium_photo-1724628163510-68f3779d8988?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGVkaXRvcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                </div>
            </div>
        </div>
    </section>
</div>

    )
}
