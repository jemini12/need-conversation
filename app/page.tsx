"use client"

import { useState } from "react"
import confetti from "canvas-confetti"
import AdminPanel from "@/components/admin-panel"
import MatchingResult from "@/components/matching-result"

export interface Team {
  id: number
  members: string[]
  topic: string
  principle: string
}

export default function Home() {
  const [people, setPeople] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [principles, setPrinciples] = useState<string[]>([])
  const [presetTrioMembers, setPresetTrioMembers] = useState<string[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [showResult, setShowResult] = useState(false)

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const fireConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
      })
    }, 250)
  }

  const generateMatching = () => {
    if (people.length < 2) {
      alert("최소 2명 이상의 참가자가 필요합니다.")
      return
    }
    if (topics.length === 0) {
      alert("최소 1개 이상의 주제가 필요합니다.")
      return
    }
    if (principles.length === 0) {
      alert("최소 1개 이상의 원리가 필요합니다.")
      return
    }

    const shuffledPeople = shuffleArray(people)
    const shuffledTopics = shuffleArray(topics)
    const shuffledPrinciples = shuffleArray(principles)
    const newTeams: Team[] = []
    let teamId = 1
    let topicIndex = 0
    let principleIndex = 0

    const validPresetMembers = [...new Set(presetTrioMembers)]
      .filter((m) => shuffledPeople.includes(m))
      .slice(0, 3)
    const remainingPeople = shuffledPeople.filter(
      (p) => !validPresetMembers.includes(p)
    )

    const needsTrioTeam = shuffledPeople.length % 2 === 1
    const forcePresetTrioInEvenCase =
      !needsTrioTeam && validPresetMembers.length > 0

    if (forcePresetTrioInEvenCase && shuffledPeople.length < 6) {
      alert(
        "짝수 인원에서 3인조를 만들려면 최소 6명의 참가자가 필요합니다."
      )
      return
    }

    if (needsTrioTeam || forcePresetTrioInEvenCase) {
      const trioMembers = [...validPresetMembers]

      while (trioMembers.length < 3 && remainingPeople.length > 0) {
        const nextMember = remainingPeople.shift()
        if (nextMember) {
          trioMembers.push(nextMember)
        }
      }

      if (trioMembers.length !== 3) {
        alert("3인조 팀을 구성하는 중 오류가 발생했습니다. 다시 시도해주세요.")
        return
      }

      newTeams.push({
        id: teamId++,
        members: trioMembers,
        topic: shuffledTopics[topicIndex++ % shuffledTopics.length],
        principle: shuffledPrinciples[principleIndex++ % shuffledPrinciples.length],
      })
    }

    if (forcePresetTrioInEvenCase) {
      const secondTrioMembers = remainingPeople.splice(0, 3)

      if (secondTrioMembers.length !== 3) {
        alert("짝수 인원 3인조 구성을 완료하지 못했습니다. 다시 시도해주세요.")
        return
      }

      newTeams.push({
        id: teamId++,
        members: secondTrioMembers,
        topic: shuffledTopics[topicIndex++ % shuffledTopics.length],
        principle: shuffledPrinciples[principleIndex++ % shuffledPrinciples.length],
      })
    }

    while (remainingPeople.length >= 2) {
      const pairMembers = remainingPeople.splice(0, 2)
      newTeams.push({
        id: teamId++,
        members: pairMembers,
        topic: shuffledTopics[topicIndex++ % shuffledTopics.length],
        principle: shuffledPrinciples[principleIndex++ % shuffledPrinciples.length],
      })
    }

    if (remainingPeople.length > 0) {
      alert("팀 구성 중 남은 인원이 발생했습니다. 다시 시도해주세요.")
      return
    }

    setTeams(shuffleArray(newTeams))
    setShowResult(true)
    fireConfetti()
  }

  const resetMatching = () => {
    setShowResult(false)
    setTeams([])
  }

  return (
    <main className="min-h-screen bg-background">
      {!showResult ? (
        <AdminPanel
          people={people}
          setPeople={setPeople}
          topics={topics}
          setTopics={setTopics}
          principles={principles}
          setPrinciples={setPrinciples}
          presetTrioMembers={presetTrioMembers}
          setPresetTrioMembers={setPresetTrioMembers}
          onGenerate={generateMatching}
        />
      ) : (
        <MatchingResult teams={teams} onReset={resetMatching} />
      )}
    </main>
  )
}
