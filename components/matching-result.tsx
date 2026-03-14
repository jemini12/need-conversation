"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, MessageSquare, Lightbulb } from "lucide-react"
import type { Team } from "@/app/page"

interface MatchingResultProps {
  teams: Team[]
  onReset: () => void
}

export default function MatchingResult({ teams, onReset }: MatchingResultProps) {
  const sortedTeams = [...teams].sort((a, b) => a.id - b.id)
  const topicBadgePalette = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-violet-100 text-violet-800 border-violet-200",
  ]
  const principleBadgePalette = [
    "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "bg-lime-100 text-lime-800 border-lime-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-sky-100 text-sky-800 border-sky-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-pink-100 text-pink-800 border-pink-200",
  ]

  const createColorMap = (values: string[], palette: string[]) => {
    return values.reduce<Record<string, string>>((acc, value, index) => {
      acc[value] = palette[index % palette.length]
      return acc
    }, {})
  }

  const uniqueTopics = [...new Set(sortedTeams.map((team) => team.topic))]
  const uniquePrinciples = [...new Set(sortedTeams.map((team) => team.principle))]
  const topicColorMap = createColorMap(uniqueTopics, topicBadgePalette)
  const principleColorMap = createColorMap(
    uniquePrinciples,
    principleBadgePalette
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
          매칭 결과
        </h1>
        <p className="text-muted-foreground">
          총 {teams.length}개의 팀이 구성되었습니다
        </p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4 px-6 py-3 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
          <div>팀</div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            멤버
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            주제
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            원리
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4 px-6 py-4 items-center animate-in fade-in slide-in-from-left-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div>
                <span className="font-semibold text-foreground">#{team.id}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {team.members.map((member) => (
                  <Badge
                    key={member}
                    variant="outline"
                    className="bg-secondary/50 border-border"
                  >
                    {member}
                  </Badge>
                ))}
              </div>

              <div>
                <Badge
                  variant="outline"
                  className={topicColorMap[team.topic] ?? "border-border"}
                >
                  {team.topic}
                </Badge>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={principleColorMap[team.principle] ?? "border-border"}
                >
                  {team.principle}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          다시 설정하기
        </Button>
      </div>
    </div>
  )
}
