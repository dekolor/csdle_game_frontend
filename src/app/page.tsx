"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
const weapons = [
  "CZ75-Auto",
  "Desert Eagle",
  "Dual Berettas",
  "Five-SeveN",
  "Glock-18",
  "P2000",
  "P250",
  "R8 Revolver",
  "Tec-9",
  "USP-S",
  "AK-47",
  "AUG",
  "AWP",
  "FAMAS",
  "G3SG1",
  "Galil AR",
  "M4A1-S",
  "M4A4",
  "SCAR-20",
  "SG 553",
  "SSG 08",
  "MAC-10",
  "MP5-SD",
  "MP7",
  "MP9",
  "PP-Bizon",
  "P90",
  "UMP-45",
  "MAG-7",
  "Nova",
  "Sawed-Off",
  "XM1014",
  "M249",
  "Negev",
  "Knife"
];

export default function CS2ArmoryGuess() {
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [dailyGuesses, setDailyGuesses] = useState(0);
  const [correctGuess, setCorrectGuess] = useState(false);

  const [challengeToken, setChallengeToken] = useState("");

  const [hasGuessed, setHasGuessed] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);

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

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:3000/leaderboard/top");
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const fetchTotalGuesses = async () => {
    try {
      const response = await fetch("http://localhost:3000/game/total-guesses");
      const data = await response.json();
      setDailyGuesses(data.totalGuesses);
    } catch (error) {
      console.error("Error fetching total guesses:", error);
    }
  };

  useEffect(() => {
    fetchChallengeToken();
    fetchLeaderboardData();
    fetchTotalGuesses();
  }, []);

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasGuessed(true);
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
    console.log("challenge token:", challengeToken)
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
            <form onSubmit={handleGuess} className="flex space-x-4">
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
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-gray-900"
              >
                Guess
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-500">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-orange-500">
                      <TableHead className="text-orange-500">Rank</TableHead>
                      <TableHead className="text-orange-500">Name</TableHead>
                      <TableHead className="text-orange-500">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((player, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-700"
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-400">
                  There are no players in the leaderboard.
                </div>
              )}
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
