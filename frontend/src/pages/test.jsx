import { Camera, Mail, User } from "lucide-react"



function Test() {
  


  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8" >
          <div className="text-center" >
            <h1 className="text-2xl font-semibold " >Profile</h1>
            <p className="mt-2" >Your profile information</p>
          </div>
          {/* avatar upload section */}

       <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img src={"/avatar.jfif"} 
          alt="profile"
          className="size-32  rounded-full object-cover border-4 " />
          <label htmlFor="avatar-upload" 
          className={`
            absolute bottom-0 right-0 p-2 rounded-full pointer transition-all duration-200 
            
               `}>

                <Camera className="w-5 h-5 text-base-200"/>
                <input type="file"
                id="avatar-upload"
                className="hidden "
                
            
                 />
               </label>
               </div>
               <p className="text-sm text-zinc-400" >
            
              </p>
       </div>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <div className="text-sm text-zinc-400 flex items-center gap-2 ">
                           <User className="w-4 h-4 " />
                           Fast Name
                      </div>
                     <input type="text" className="px-4 py-2.5 bg-base-200 w-full rounded-lg border" placeholder="First name....." />
                    </div>


                     <div className="space-y-1.5">
                      <div className="text-sm text-zinc-400 flex items-center gap-2 ">
                           <User className="w-4 h-4 " />
                           Last Name
                      </div>
                     <input type="text" className="px-4 py-2.5 bg-base-200 w-full rounded-lg border" placeholder="Last Name....." />
                     </div>

                    

                      <div className="space-y-1.5">
                      <div className="text-sm text-zinc-400 flex items-center gap-2 ">
                           <Mail className="w-4 h-4 " />
                           Email Address
                      </div>
                      <input type="text" className="px-4 py-2.5 bg-base-200 w-full rounded-lg border" placeholder="Example@gmail.com...." />
                    </div>
                      <button 
                                  type='submit' 
                                  className='btn btn-primary w-full'> 
                                
                                    Update
                              
                                </button>
                  </div>
                  <div className="mt-6 bg-base-300 rounded-xl p-6" >
                    <h2 className="text-lg font-medium mb-4" >Account information</h2>
                    <div className="space-y-3 text-sm">
                     
                      <div className="flex items-center justify-between py-2">
                        <span>Account Status</span>
                        <span className="text-green-500" > Active</span>
                      </div>
                    </div>
                      </div>

                </div>
      </div>
    </div>
  )
}

export default Test