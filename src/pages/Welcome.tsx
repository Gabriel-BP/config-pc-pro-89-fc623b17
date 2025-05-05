
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, Memory, Power, Monitor, Settings } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useEffect, useState } from "react";

export default function Welcome() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <InteractiveBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Floating PC Components */}
        <div className={`absolute inset-0 pointer-events-none ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
          <Cpu className="absolute top-[15%] left-[10%] text-purple-400/30 h-12 w-12 animate-float" />
          <HardDrive className="absolute top-[25%] right-[15%] text-blue-400/30 h-16 w-16 animate-float-delayed" />
          <Memory className="absolute bottom-[20%] left-[20%] text-indigo-400/30 h-14 w-14 animate-float" />
          <Power className="absolute top-[40%] left-[25%] text-cyan-400/30 h-10 w-10 animate-float-delayed" />
          <Monitor className="absolute bottom-[30%] right-[10%] text-purple-400/30 h-16 w-16 animate-float" />
        </div>
        
        <div className="space-y-6 text-center">
          {/* Title with glowing effect */}
          <h1 
            className={`
              text-5xl md:text-7xl font-bold mb-8
              bg-clip-text text-transparent 
              bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400
              animate-gradient-x
              drop-shadow-[0_0_25px_rgba(139,92,246,0.3)]
              transition-all duration-1000 transform
              ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            `}
          >
            PC Builder Pro
          </h1>
          
          {/* Subtitle with animation */}
          <p 
            className={`
              text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300
              transition-all duration-1000 delay-300 transform
              ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            `}
          >
            Configura tu PC ideal con nuestro asistente inteligente
          </p>
          
          {/* Button with hover effects */}
          <div className={`
            transition-all duration-1000 delay-600 transform
            ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <Button
              onClick={() => navigate("/filters")}
              size="lg"
              className="
                relative overflow-hidden group
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 
                text-white px-8 py-6 text-lg rounded-xl
                shadow-[0_0_15px_rgba(66,153,225,0.5)]
                hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]
                transition-all duration-300
                animate-scale-in
              "
            >
              {/* Button glow effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-white/30 to-blue-400/0 -skew-x-[20deg] translate-x-[-120%] group-hover:translate-x-[120%] transition-all duration-1000 ease-in-out" />
              
              <Settings className="mr-2 animate-pulse-slow" />
              Configurar PC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
