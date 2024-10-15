"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for weapons and leaderboard
const weapons = ["AK-47", "M4A1-S", "AWP", "Desert Eagle"];
const leaderboard = [
  { rank: 1, name: "Skylex", score: 15 },
  { rank: 2, name: "appl3Z0R", score: 14 },
  { rank: 3, name: "dekolor", score: 13 },
  { rank: 4, name: "Anost", score: 12 },
  { rank: 5, name: "matricea", score: 11 },
];

export default function CS2ArmoryGuess() {
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [dailyGuesses, setDailyGuesses] = useState(1337); // Mock data for daily guesses
  const [correctGuess, setCorrectGuess] = useState(false);

  const [challengeToken, setChallengeToken] = useState("");

  const fetchChallengeToken = async () => {
    const challenge = localStorage.getItem("challengeToken");
    if (!challenge) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/game/challenge`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      localStorage.setItem("challengeToken", data.challengeId);
      setChallengeToken(data.challengeId);
    } else {
      setChallengeToken(challenge);
    }
  };

  useEffect(() => {
    fetchChallengeToken();
  }, []);

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(challengeToken);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/game/guess`,
      {
        method: "POST",
        body: new URLSearchParams({
          guess: selectedWeapon || guessInput,
        }),
        headers: {
          "challenge-id": challengeToken,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    if (data.correct) {
      setCorrectGuess(true);
      localStorage.removeItem("challengeToken");
      setChallengeToken("");
      fetchChallengeToken();
    } else {
      setCorrectGuess(false);
    }
    // Here you would typically send the guess to your backend
    console.log("Guessed weapon:", selectedWeapon || guessInput);
    setDailyGuesses((prev) => prev + 1);
    // Reset form
    setSelectedWeapon("");
    setGuessInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
          CSdle
        </h1>

        <Card className="mb-8 bg-gray-800 border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Guess Today's Weapon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGuess} className="space-y-4">
              <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
                <SelectTrigger className="bg-gray-700 border-orange-500 text-gray-100">
                  <SelectValue placeholder="Select a weapon" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-orange-500">
                  {weapons.map((weapon) => (
                    <SelectItem
                      key={weapon}
                      value={weapon}
                      className="text-gray-100 hover:bg-orange-500 hover:text-gray-900"
                    >
                      {weapon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Or type your guess here"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  className={`bg-gray-700 border-2 ${
                    correctGuess ? 'border-green-500' : 'border-red-500'
                  } text-gray-100 placeholder-gray-400`}
                />
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-gray-900"
                >
                  Guess
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-500">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-orange-500">
                    <TableHead className="text-orange-500">Rank</TableHead>
                    <TableHead className="text-orange-500">Name</TableHead>
                    <TableHead className="text-orange-500">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((player) => (
                    <TableRow
                      key={player.rank}
                      className="border-b border-gray-700"
                    >
                      <TableCell>{player.rank}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-500">Daily Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-center text-orange-500">
                {dailyGuesses}
              </div>
              <div className="text-center text-gray-400">Guesses Today</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
