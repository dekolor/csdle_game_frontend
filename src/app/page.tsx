'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"

const weapons = [
  "CZ75-Auto", "Desert Eagle", "Dual Berettas", "Five-SeveN", "Glock-18", "P2000",
  "P250", "R8 Revolver", "Tec-9", "USP-S", "AK-47", "AUG", "AWP", "FAMAS", "G3SG1",
  "Galil AR", "M4A1-S", "M4A4", "SCAR-20", "SG 553", "SSG 08", "MAC-10", "MP5-SD",
  "MP7", "MP9", "PP-Bizon", "P90", "UMP-45", "MAG-7", "Nova", "Sawed-Off", "XM1014",
  "M249", "Negev", "Knife"
]

export default function CS2ArmoryGuess() {
  const [selectedWeapon, setSelectedWeapon] = useState("")
  const [guessInput, setGuessInput] = useState("")
  const [dailyGuesses, setDailyGuesses] = useState(0)
  const [correctGuess, setCorrectGuess] = useState(false)
  const [challengeType, setChallengeType] = useState("")
  const [hasGuessed, setHasGuessed] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState("")
  const [guessResult, setGuessResult] = useState<null | { correct: boolean; message: string }>(null)

  const fetchChallenge = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/daily-challenge`, {
      method: "GET",
    })
    const data = await response.json()
    setChallengeType(data.type)
  }

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:3000/leaderboard/top")
      const data = await response.json()
      setLeaderboardData(data)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
    }
  }

  const fetchTotalGuesses = async () => {
    try {
      const response = await fetch("http://localhost:3000/game/total-guesses")
      const data = await response.json()
      setDailyGuesses(data.totalGuesses)
    } catch (error) {
      console.error("Error fetching total guesses:", error)
    }
  }

  useEffect(() => {
    fetchChallenge()
    fetchLeaderboardData()
    fetchTotalGuesses()
  }, [])

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasGuessed(true)

    const guess = challengeType === "guess_weapon" ? selectedWeapon : guessInput

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/daily-challenge/guess`, {
      method: "POST",
      body: JSON.stringify({ guess }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (data.correct) {
      setCorrectGuess(true)
      setShowModal(true)
      fetchChallenge()
    } else {
      setCorrectGuess(false)
    }
    setDailyGuesses((prev) => prev + 1)
    setSelectedWeapon("")
    setGuessInput("")
    setGuessResult({ correct: data.correct, message: data.message || "Incorrect guess. Try again!" })
  }

  const handleUsernameSubmit = async () => {
    try {
      await fetch("http://localhost:3000/leaderboard/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: username, score: 10 }),
      })
      setShowModal(false)
      setUsername("")
      fetchLeaderboardData()
    } catch (error) {
      console.error("Error adding user to leaderboard:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-orange-500">CSdle</h1>

        <Card className="mb-8 bg-gray-800 border-orange-500">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-500">
              Guess Today's {challengeType === "guess_weapon" ? "Weapon" : challengeType === "guess_pro_player" ? "Pro Player" : "Skin"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGuess} className="space-y-4">
              {challengeType === "guess_weapon" ? (
                <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
                  <SelectTrigger className={`w-full bg-gray-700 border-2 ${hasGuessed ? correctGuess ? 'border-green-500' : 'border-red-500' : 'border-transparent'} text-gray-100`}>
                    <SelectValue placeholder="Select a weapon" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-orange-500 max-h-[300px]">
                    {weapons.map((weapon) => (
                      <SelectItem key={weapon} value={weapon} className="text-gray-100 hover:bg-orange-500 hover:text-gray-900">
                        {weapon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  className="w-full p-2 bg-gray-700 border-2 text-gray-100"
                  placeholder={challengeType === "guess_pro_player" ? "Enter a pro player" : "Enter a skin"}
                />
              )}
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-gray-900">
                Guess
              </Button>
            </form>
            {guessResult && (
              <div className={`mt-4 p-3 rounded-md ${guessResult.correct ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center`}>
                {guessResult.correct ? (
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                )}
                <p>{guessResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-xl text-orange-500 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </CardTitle>
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
                      <TableRow key={index} className="border-b border-gray-700">
                        <TableCell className="text-white">{index + 1}</TableCell>
                        <TableCell className="text-white">{player.playerName}</TableCell>
                        <TableCell className="text-white">{player.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-400">There are no players in the leaderboard.</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-xl text-orange-500">Daily Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-center text-orange-500">{dailyGuesses}</div>
              <div className="text-center text-gray-400">Guesses Today</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-500">Congratulations!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="username" className="text-gray-100 mb-2 block">
              Enter your username to be added to the leaderboard:
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 border border-orange-500 text-gray-100"
              placeholder="Username"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleUsernameSubmit} className="bg-orange-500 hover:bg-orange-600 text-gray-900">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}