import React from "react";
import { FC } from "react";
import { Github, Twitter } from "lucide-react";

const BottomBar: FC = () => {
  return (
    <div className="z-50">
      <div className="backdrop-blur-md bg-black/20 border-t border-white/10 shadow-2xl">
        <div className="px-4 md:px-8 lg:px-32 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Copyright */}
            <div className="text-sm text-blue-100 flex items-center space-x-1">
              <span>Made with ❤️ by</span>
              <a 
                href="https://x.com/gambishhhh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-purple-300 transition-colors duration-300"
              >
                Garvit
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/GarvitDadheech/LaunchPlex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white transition-colors duration-300 hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://x.com/gambishhhh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white transition-colors duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;