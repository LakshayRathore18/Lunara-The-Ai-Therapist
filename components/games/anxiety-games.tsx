"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Flower2, Wind, TreePine, Waves, Music2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Import individual game components
import { BreathingGame } from "./breathing-game";
import { ZenGarden } from "./zen-garden";
import { ForestGame } from "./forest-game";
import { OceanWaves } from "./ocean-waves";

// =====================
// GAME CONFIGURATION
// =====================
const GAMES = [
    {
        id: "breathing",
        title: "Breathing Patterns",
        description: "Follow calming breathing exercises with visual guidance",
        icon: Wind,                 // Game icon component
        color: "text-blue-500",     // Icon color
        bgColor: "bg-blue-500/10",  // Icon background color
        duration: "5 mins",         // Displayed duration
        component: BreathingGame,   // Which component to render
    },
    {
        id: "garden",
        title: "Zen Garden",
        description: "Create and maintain your digital peaceful space",
        icon: Flower2,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        duration: "10 mins",
        component: ZenGarden,
    },
    {
        id: "forest",
        title: "Mindful Forest",
        description: "Take a peaceful walk through a virtual forest",
        icon: TreePine,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        duration: "15 mins",
        component: ForestGame,
    },
    {
        id: "waves",
        title: "Ocean Waves",
        description: "Match your breath with gentle ocean waves",
        icon: Waves,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        duration: "8 mins",
        component: OceanWaves,
    },
];

// =====================
// REUSABLE GAME CARD COMPONENT
// =====================
// Single card for a game in the grid
interface GameCardProps {
    game: (typeof GAMES)[number]; // Single game config
    isSelected: boolean;          // Highlight if selected
    onClick: () => void;          // Handle card click
}

const GameCard = ({ game, isSelected, onClick }: GameCardProps) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
            onClick={onClick}
            className={`cursor-pointer border-primary/10 hover:bg-primary/5 transition-colors ${isSelected ? "ring-2 ring-primary" : ""
                }`}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Left: Icon with colored circle */}
                    <div className={`p-3 rounded-xl ${game.bgColor} ${game.color}`}>
                        <game.icon className="h-6 w-6" />
                    </div>

                    {/* Right: Title + Description + Duration */}
                    <div className="flex-1">
                        <h4 className="font-semibold">{game.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {game.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <Music2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {game.duration}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// =====================
// MAIN COMPONENT
// =====================
interface AnxietyGamesProps {
    onGamePlayed?: (gameName: string, description: string) => Promise<void>;  // Optional callback to log activity
}

export const AnxietyGames = ({ onGamePlayed }: AnxietyGamesProps) => {
    // Currently selected game (null if none)
    const [selectedGame, setSelectedGame] = useState<(typeof GAMES)[number] | null>(null);

    // Controls whether modal/dialog is open
    const [showGame, setShowGame] = useState(false);

    // Handle clicking a game card
    const handleGameStart = async (game: (typeof GAMES)[number]) => {
        setSelectedGame(game); // Store which game is chosen
        setShowGame(true);     // Open modal

        // Log activity if parent provided a callback
        if (onGamePlayed) {
            try {
                await onGamePlayed(game.id, game.description);
            } catch (error) {
                console.error("Error logging game activity:", error);
            }
        }
    };

    return (
        <>
            {/* Main Card containing all games */}
            <Card className="border-primary/10">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-primary" />
                        Anxiety Relief Activities
                    </CardTitle>
                    <CardDescription>
                        Interactive exercises to help reduce stress and anxiety
                    </CardDescription>
                </CardHeader>

               <CardContent>
                    {/* Game Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {GAMES.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                isSelected={selectedGame?.id === game.id}
                                onClick={() => handleGameStart(game)}
                            />
                        ))}
                    </div>

                    {/* Optional "Start Game" button (resets selection) */}
                    {selectedGame && (
                        <div className="mt-6 text-center">
                            <Button className="gap-2" onClick={() => setSelectedGame(null)}>
                                <Gamepad2 className="h-4 w-4" />
                                Start {selectedGame.title}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal with the actual game */}
            <Dialog open={showGame} onOpenChange={setShowGame}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedGame?.title}</DialogTitle> {/* Dialog shows the game title */}
                    </DialogHeader>

                    {/* Render the actual game component dynamically */}
                    {selectedGame && <selectedGame.component />}
                </DialogContent>
            </Dialog>
        </>
    );
};
