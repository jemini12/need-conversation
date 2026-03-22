"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Plus,
  Minus,
  X,
  Shuffle,
  Upload,
  FileSpreadsheet,
  Lightbulb,
} from "lucide-react"
import * as XLSX from "xlsx"

interface AdminPanelProps {
  people: string[]
  setPeople: (people: string[]) => void
  topics: string[]
  setTopics: (topics: string[]) => void
  principles: string[]
  setPrinciples: (principles: string[]) => void
  teamSize: 2 | 3 | 4
  setTeamSize: (size: 2 | 3 | 4) => void
  onGenerate: () => void
}

export default function AdminPanel({
  people,
  setPeople,
  topics,
  setTopics,
  principles,
  setPrinciples,
  teamSize,
  setTeamSize,
  onGenerate,
}: AdminPanelProps) {
  const [newPerson, setNewPerson] = useState("")
  const [newTopic, setNewTopic] = useState("")
  const [newPrinciple, setNewPrinciple] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = event.target?.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)

      const names: string[] = []
      const topicsList: string[] = []
      const principlesList: string[] = []

      jsonData.forEach((row) => {
        // "이름" 또는 "name" 열에서 이름 추출
        const name = row["이름"] || row["name"] || row["Name"] || row["NAME"]
        if (name && typeof name === "string" && name.trim()) {
          const trimmedName = name.trim()
          if (!names.includes(trimmedName) && !people.includes(trimmedName)) {
            names.push(trimmedName)
          }
        }

        // "주제" 또는 "대화 상황" 열에서 토픽 추출
        const topic = row["주제"] || row["대화 상황"] || row["topic"] || row["Topic"] || row["TOPIC"]
        if (topic && typeof topic === "string" && topic.trim()) {
          const trimmedTopic = topic.trim()
          if (!topicsList.includes(trimmedTopic) && !topics.includes(trimmedTopic)) {
            topicsList.push(trimmedTopic)
          }
        }

        // "적용 원리" 또는 "원리" 열에서 원리 추출
        const principle = row["적용 원리"] || row["원리"] || row["principle"] || row["Principle"] || row["PRINCIPLE"]
        if (principle && typeof principle === "string" && principle.trim()) {
          const trimmedPrinciple = principle.trim()
          if (!principlesList.includes(trimmedPrinciple) && !principles.includes(trimmedPrinciple)) {
            principlesList.push(trimmedPrinciple)
          }
        }
      })

      if (names.length > 0) {
        setPeople([...people, ...names])
      }
      if (topicsList.length > 0) {
        setTopics([...topics, ...topicsList])
      }
      if (principlesList.length > 0) {
        setPrinciples([...principles, ...principlesList])
      }
    }
    reader.readAsBinaryString(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addPerson = () => {
    if (newPerson.trim() && !people.includes(newPerson.trim())) {
      setPeople([...people, newPerson.trim()])
      setNewPerson("")
    }
  }

  const removePerson = (person: string) => {
    setPeople(people.filter((p) => p !== person))
  }

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()])
      setNewTopic("")
    }
  }

  const removeTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic))
  }

  const addPrinciple = () => {
    if (newPrinciple.trim() && !principles.includes(newPrinciple.trim())) {
      setPrinciples([...principles, newPrinciple.trim()])
      setNewPrinciple("")
    }
  }

  const removePrinciple = (principle: string) => {
    setPrinciples(principles.filter((p) => p !== principle))
  }

  const decreaseTeamSize = () => {
    if (teamSize > 2) {
      setTeamSize((teamSize - 1) as 2 | 3 | 4)
    }
  }

  const increaseTeamSize = () => {
    if (teamSize < 4) {
      setTeamSize((teamSize + 1) as 2 | 3 | 4)
    }
  }

  const handleKeyPress = (
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
          대화가 필요해
        </h1>
        <p className="text-muted-foreground">
          활동에 필요한 참가자, 주제, 원리를 선정합니다
        </p>
      </div>

      {/* Excel Upload */}
      <Card className="border-border bg-card mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">엑셀 파일 업로드</p>
                <p className="text-sm text-muted-foreground">
                  {"\"이름\", \"주제\", \"원리\" 열이 포함된 엑셀 파일을 업로드하세요"}
                </p>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                파일 선택
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* People List */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              이름
              <Badge variant="secondary" className="ml-auto">
                {people.length}명
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="이름 입력"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addPerson)}
                className="bg-input border-border"
              />
              <Button onClick={addPerson} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[100px] p-3 rounded-lg bg-secondary/50 border border-border">
              {people.length === 0 ? (
                <p className="text-muted-foreground text-sm w-full text-center py-6">
                  참가자를 추가해주세요
                </p>
              ) : (
                people.map((person) => (
                  <Badge
                    key={person}
                    variant="outline"
                    className="h-8 px-3 gap-1 bg-card border-border hover:bg-secondary transition-colors"
                  >
                    {person}
                    <button
                      type="button"
                      onClick={() => removePerson(person)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Topics List */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              주제
              <Badge variant="secondary" className="ml-auto">
                {topics.length}개
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="주제 입력"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTopic)}
                className="bg-input border-border"
              />
              <Button onClick={addTopic} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[100px] p-3 rounded-lg bg-secondary/50 border border-border">
              {topics.length === 0 ? (
                <p className="text-muted-foreground text-sm w-full text-center py-6">
                  주제를 추가해주세요
                </p>
              ) : (
                topics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="h-8 px-3 gap-1 bg-card border-border hover:bg-secondary transition-colors"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Principles List */}
      <Card className="border-border bg-card mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            원리
            <Badge variant="secondary" className="ml-auto">
              {principles.length}개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="원리 입력"
              value={newPrinciple}
              onChange={(e) => setNewPrinciple(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addPrinciple)}
              className="bg-input border-border"
            />
            <Button onClick={addPrinciple} size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[100px] p-3 rounded-lg bg-secondary/50 border border-border">
            {principles.length === 0 ? (
              <p className="text-muted-foreground text-sm w-full text-center py-6">
                원리를 추가해주세요
              </p>
            ) : (
              principles.map((principle) => (
                <Badge
                  key={principle}
                  variant="outline"
                  className="h-8 px-3 gap-1 bg-card border-border hover:bg-secondary transition-colors"
                >
                  {principle}
                  <button
                    type="button"
                    onClick={() => removePrinciple(principle)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            팀 인원 선택
            <Badge variant="secondary" className="ml-auto">
              {teamSize}명
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decreaseTeamSize}
              disabled={teamSize <= 2}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="min-w-24 text-center text-2xl font-semibold text-foreground">
              {teamSize}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={increaseTeamSize}
              disabled={teamSize >= 4}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            버튼으로 팀 인원 수(2~4명)를 선택합니다. 남는 인원은 더 적은 인원 팀으로 구성됩니다.
          </p>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onGenerate}
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
          disabled={people.length < 2 || topics.length === 0 || principles.length === 0}
        >
          <Shuffle className="h-5 w-5 mr-2" />
          매칭 시작
        </Button>
      </div>

      {(people.length < 2 || topics.length === 0 || principles.length === 0) && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          {people.length < 2 && "최소 2명 이상의 참가자가 필요합니다. "}
          {topics.length === 0 && "최소 1개 이상의 주제가 필요합니다. "}
          {principles.length === 0 && "최소 1개 이상의 원리가 필요합니다."}
        </p>
      )}
    </div>
  )
}
