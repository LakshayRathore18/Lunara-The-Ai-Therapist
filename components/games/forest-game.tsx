"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TreePine, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress"; // ShadCN progress bar

// Meditation session length: 5 min (in seconds)
const MEDITATION_DURATION = 5 * 60;

export function ForestGame() {
    // ------------------- 1. State Management -------------------
    const [isPlaying, setIsPlaying] = useState(false); // Is meditation running?
    const [volume, setVolume] = useState(50);          // Volume percentage
    const [progress, setProgress] = useState(0);       // Progress (0-100%)
    const [timeLeft, setTimeLeft] = useState(MEDITATION_DURATION); // Remaining time

    // Load audio elements for background sounds
    const [audioElements] = useState({
        birds: new Audio("/sounds/birds.mp3"),
        wind: new Audio("/sounds/wind.mp3"),
        leaves: new Audio("/sounds/leaves.mp3"),
    });

    // ------------------- 2. Initialize Audio on Mount -------------------
    useEffect(() => {
        // Loop all sounds & set initial volume
        Object.values(audioElements).forEach((audio) => {
            audio.loop = true;
            audio.volume = volume / 100;
        });

        return () => {
            // Cleanup on unmount → stop audio
            Object.values(audioElements).forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    // ------------------- 3. Update Audio Volume When Slider Changes -------------------
    useEffect(() => {
        Object.values(audioElements).forEach((audio) => {
            audio.volume = volume / 100;
        });
    }, [volume]);

    // ------------------- 4. Timer & Progress Handling -------------------
    useEffect(() => {
        let timer: NodeJS.Timeout;

        // Run countdown if playing and time remains
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {

                setTimeLeft((prev) => {
                    const newTime = prev - 1;

                    // Update progress bar based on time
                    setProgress(((MEDITATION_DURATION - newTime) / MEDITATION_DURATION) * 100);

                    return newTime;
                });
                
            }, 1000); // Update every second
        }

        return () => clearInterval(timer); // Cleanup timer on pause/unmount
    }, [isPlaying, timeLeft]);

    // ------------------- 5. Play/Pause Toggle -------------------
    const togglePlay = () => {
        if (isPlaying) {
            // Pause all audio tracks
            Object.values(audioElements).forEach((audio) => audio.pause());
        } else {
            // Play all audio tracks
            Object.values(audioElements).forEach((audio) => audio.play());
        }
        setIsPlaying(!isPlaying);
    };

    // ------------------- 6. Format Time as MM:SS -------------------
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // ------------------- 7. UI Layout -------------------
    return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-8">

            {/* ---------- Animated Tree in Circle ---------- */}
            <div className="relative w-48 h-48">
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1], // Slight pulse effect
                        rotate: [0, 1, -1, 0], // Gentle sway
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0"
                >
                    {/* Glowing background circle */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent rounded-full blur-xl" />
                    {/* Center tree icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TreePine className="w-24 h-24 text-green-600" />
                    </div>
                </motion.div>
            </div>

            {/* ---------- Controls & Progress Section ---------- */}
            <div className="w-64 space-y-6">

                {/* Volume Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Volume</span>
                        <span>{volume}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Volume icon switches between mute and volume */}
                        {volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                        <Slider
                            value={[volume]}                    // Controlled by volume state
                            onValueChange={(value) => setVolume(value[0])}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>

                {/* Session Progress Bar */}
                <Progress value={progress} className="h-2" />

                {/* Timer + Play/Pause Button */}
                <div className="flex items-center justify-between">
                    {/* Time Left */}
                    <span className="text-sm text-muted-foreground">
                        {formatTime(timeLeft)}
                    </span>

                    {/* Circular Play/Pause Button */}
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
                        {formatTime(MEDITATION_DURATION)}
                    </span>
                </div>
            </div>
        </div>
    );
}
