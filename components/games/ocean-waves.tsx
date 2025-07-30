"use client"; 

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion"; 
import { Waves, Volume2, VolumeX, Play, Pause } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Slider } from "@/components/ui/slider"; 
import { Progress } from "@/components/ui/progress"; // ShadCN progress bar

// ------------------- 1. Session Config -------------------
const BREATH_DURATION = 8;       // Duration of a single breath/wave cycle in seconds
const SESSION_DURATION = 5 * 60; // 5-minute meditation session (in seconds)

export function OceanWaves() {
    // ------------------- 2. State Management -------------------
    const [isPlaying, setIsPlaying] = useState(false); // Is the session active?
    const [volume, setVolume] = useState(50);          // Audio volume (0–100)
    const [progress, setProgress] = useState(0);       // Progress bar value (0–100)
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATION); // Remaining session time in seconds

    const waveControls = useAnimation();               // Framer Motion animation controller
    const [audio] = useState(new Audio("/sounds/waves.mp3")); // Single ocean wave audio

    // ------------------- 3. Initialize Audio on Mount -------------------
    useEffect(() => {
        audio.loop = true;             // Keep ocean sound looping
        audio.volume = volume / 100;    // Initial volume

        return () => {
            // Cleanup on unmount → stop and reset audio
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    // ------------------- 4. Sync Volume Slider with Audio -------------------
    useEffect(() => {
        audio.volume = volume / 100;
    }, [volume]);

    // ------------------- 5. Timer + Animation Effect -------------------
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPlaying && timeLeft > 0) {
            // 1. Countdown timer
            timer = setInterval(() => {
                
                setTimeLeft((prev) => {
                    const newTime = prev - 1;

                    // Update progress bar percentage
                    setProgress(((SESSION_DURATION - newTime) / SESSION_DURATION) * 100);

                    return newTime;
                });
            
            }, 1000);

            // 2. Animate wave motion (up-down breathing effect)
            waveControls.start({
                y: [0, -20, 0], // Wave goes up, then down
                transition: {
                    duration: BREATH_DURATION,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
            });
        } else {
            // Stop animation if paused or session ended
            waveControls.stop();
        }

        return () => clearInterval(timer); // Cleanup timer
    }, [isPlaying, timeLeft]);

    // ------------------- 6. Play/Pause Toggle -------------------
    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // ------------------- 7. Utility: Format seconds as MM:SS -------------------
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // ------------------- 8. UI Layout -------------------
    return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-8">

            {/* ---------- Animated Waves in Circle ---------- */}
            <div className="relative w-48 h-48">
                {/* Glowing background circle */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-xl" />

                {/* Wave animation (y-axis) */}
                <motion.div
                    animate={waveControls}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="relative">
                        {/* Center wave icon */}
                        <Waves className="w-24 h-24 text-blue-600" />

                        {/* Pulsing aura effect */}
                        <motion.div
                            animate={{ opacity: [0.5, 0.8, 0.5] }} // Soft fade in/out
                            transition={{
                                duration: BREATH_DURATION,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-blue-400/10 blur-xl rounded-full"
                        />
                    </div>
                </motion.div>
            </div>

            {/* ---------- Controls & Progress Section ---------- */}
            <div className="w-64 space-y-6">

                {/* Volume Control */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Volume</span>
                        <span>{volume}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Volume icon switches */}
                        {volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                        <Slider
                            value={[volume]}                     // Controlled slider
                            onValueChange={(value) => setVolume(value[0])}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>

                {/* Session Progress Bar */}
                <Progress value={progress} className="h-2" />

                {/* Timer + Play/Pause Controls */}
                <div className="flex items-center justify-between">
                    {/* Time Left */}
                    <span className="text-sm text-muted-foreground">
                        {formatTime(timeLeft)}
                    </span>

                    {/* Play/Pause Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={togglePlay}
                        className="rounded-full"
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Total Session Time */}
                    <span className="text-sm text-muted-foreground">
                        {formatTime(SESSION_DURATION)}
                    </span>
                </div>
            </div>
        </div>
    );
}
