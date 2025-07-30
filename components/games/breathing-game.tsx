"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // UI progress bar
import { Button } from "@/components/ui/button";

const TOTAL_ROUNDS = 5; // Total number of breathing rounds

export function BreathingGame() {

    // State variables to manage breathing phases, progress, rounds, and completion
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [progress, setProgress] = useState(0);
    const [round, setRound] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Main effect controlling the breathing animation & progress
    useEffect(() => {
        // If completed or paused, stop running timers
        if (isComplete || isPaused) return;

        // Timer to control the breathing phases
        let timer: NodeJS.Timeout;

        // INHALE phase: progress slowly increases
        if (phase === "inhale") {
            timer = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        // Move to hold phase when inhale completes
                        setPhase("hold");
                        return 0;
                    }
                    return p + 2; // Increment progress
                });
            }, 100);

            // HOLD phase: progress fills faster
        } else if (phase === "hold") {
            timer = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        // Move to exhale phase after hold
                        setPhase("exhale");
                        return 0;
                    }
                    return p + 4;
                });
            }, 100);

            // EXHALE phase: progress decreases slowly
        } else {
            timer = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        // If last round is done, mark complete
                        if (round >= TOTAL_ROUNDS) {
                            setIsComplete(true);
                            return p;
                        }
                        // Otherwise, start a new inhale for next round
                        setPhase("inhale");
                        setRound((r) => r + 1);
                        return 0;
                    }
                    return p + 2;
                });
            }, 100);
        }

        // Cleanup: clear timer when effect reruns/unmounts
        return () => clearInterval(timer);
    }, [phase, round, isComplete, isPaused]);

    // Reset everything to initial state
    const handleReset = () => {
        setPhase("inhale");
        setProgress(0);
        setRound(1);
        setIsComplete(false);
        setIsPaused(false);
    };

    // ✅ COMPLETION SCREEN
    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-6">

                {/* Animated green check mark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                    <Check className="w-10 h-10 text-green-500" />
                </motion.div>

                <h3 className="text-2xl font-semibold">Great job!</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                    You've completed {TOTAL_ROUNDS} rounds of breathing exercises. How do
                    you feel?
                </p>

                {/* Button to restart the breathing exercise */}
                <Button onClick={handleReset} className="mt-4">
                    Start Again
                </Button>

            </div>
        );
    }

    // MAIN BREATHING SCREEN
    return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-8">

            {/* ------------------- 1. Breathing Animation ------------------- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={phase} // Phase change triggers re-animation
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center space-y-4"
                >

                    {/* Circle + Icon */}
                    <div className="relative w-32 h-32 mx-auto">

                        {/* Expanding / contracting breathing circle */}
                        <motion.div
                            // Animate scale based on breathing phase; default to 1.2 if unknown
                            animate={{ scale: { inhale: 1.5, exhale: 1, hold: 1.2 }[phase] || 1.2 }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                            className="absolute inset-0 bg-primary/10 rounded-full"
                        />

                        {/* Center wind icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Wind className="w-8 h-8 text-primary" />
                        </div>

                    </div>

                    {/* Phase Text */}
                    <h3 className="text-2xl font-semibold">
                        {{ inhale: "Inhale", hold: "Hold", exhale: "Exhale" }[phase] || "Breathing"}
                    </h3>

                </motion.div>
            </AnimatePresence>

            {/* ------------------- 2. Phase Progress Bar ------------------- */}
            <div className="w-64">
                <Progress value={progress} className="h-2" />
            </div>

            {/* ------------------- 3. Controls & Round Info ------------------- */}
            <div className="space-y-2 text-center">
                {/* Round Counter */}
                <div className="text-sm text-muted-foreground">
                    Round {round} of {TOTAL_ROUNDS}
                </div>

                {/* Pause/Resume Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                >
                    {isPaused ? "Resume" : "Pause"}
                </Button>
            </div>

        </div>
    );

}
