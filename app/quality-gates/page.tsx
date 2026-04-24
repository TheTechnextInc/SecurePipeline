"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, Edit, Copy, MoreVertical, Settings, Star,
} from "lucide-react"
import type { QualityGateCondition } from "@/lib/store"

function ConditionRow({ condition, gateId, onRemove }: { condition: QualityGateCondition; gateId: string; onRemove: () => void }) {
  const statusColors = { passed: "text-success", failed: "text-destructive", warning: "text-warning" }
  const StatusIcon = condition.status === "passed" ? CheckCircle2 : condition.status === "failed" ? XCircle : AlertTriangle
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-3">
        <StatusIcon className={`h-4 w-4 ${statusColors[condition.status]}`} />
        <span className="text-sm text-foreground">{condition.metric}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">{condition.operator === ">" ? "worse than" : "better than"} {condition.threshold}{condition.unit}</span>
        <div className={`font-medium ${statusColors[condition.status]}`}>{condition.actual !== undefined ? `${condition.actual}${condition.unit}` : "-"}</div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-6 w-6 text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
      </div>
    </div>
  )
}

export default function QualityGatesPage() {
  const { qualityGates, addQualityGate, removeQualityGate, setDefaultGate, addCondition, removeCondition } = useStore()
  const [selectedGateId, setSelectedGateId] = useState(qualityGates[0]?.id || "")
  const [createOpen, setCreateOpen] = useState(false)
  const [conditionOpen, setConditionOpen] = useState(false)
  const [newGate, setNewGate] = useState({ name: "", description: "" })
  const [newCondition, setNewCondition] = useState({ metric: "", operator: "<", threshold: "0", unit: "%" })

  const selectedGate = qualityGates.find(g => g.id === selectedGateId) || qualityGates[0]

  const handleCreateGate = () => {
    if (!newGate.name) return
    addQualityGate(newGate.name, newGate.description)
    setCreateOpen(false)
    setNewGate({ name: "", description: "" })
  }

  const handleAddCondition = () => {
    if (!newCondition.metric || !selectedGate) return
    addCondition(selectedGate.id, newCondition.metric, newCondition.operator, Number(newCondition.threshold), newCondition.unit)
    setConditionOpen(false)
    setNewCondition({ metric: "", operator: "<", threshold: "0", unit: "%" })
  }

  const handleDuplicate = () => {
    if (!selectedGate) return
    addQualityGate(`${selectedGate.name} (Copy)`, selectedGate.description)
  }

  return (
    <DashboardLayout title="Quality Gates" description="Configure quality thresholds that code must meet before deployment">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gate List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Quality Gates</h3>
            <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Create</Button>
          </div>
          <div className="space-y-2">
            {qualityGates.map(gate => (
              <Card key={gate.id}
                className={`cursor-pointer border-border bg-card transition-colors hover:bg-muted/50 ${selectedGate?.id === gate.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedGateId(gate.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{gate.name}</span>
                        {gate.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{gate.conditions.length} conditions</p>
                    </div>
                    <Badge variant={gate.status === "passed" ? "default" : "destructive"} className={gate.status === "passed" ? "bg-success text-success-foreground" : ""}>{gate.status === "passed" ? "Passed" : "Failed"}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gate Details */}
        <div className="space-y-6 lg:col-span-2">
          {selectedGate ? (
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-foreground">{selectedGate.name}</CardTitle>
                    {selectedGate.status === "passed" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                  <CardDescription>{selectedGate.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2" onClick={handleDuplicate}><Copy className="h-4 w-4" />Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => setDefaultGate(selectedGate.id)}><Star className="h-4 w-4" />Set as Default</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => { removeQualityGate(selectedGate.id); setSelectedGateId(qualityGates[0]?.id || "") }}><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-4">
                  <div><p className="text-sm text-muted-foreground">Status</p><p className={`text-lg font-semibold ${selectedGate.status === "passed" ? "text-success" : "text-destructive"}`}>{selectedGate.status === "passed" ? "All conditions met" : "Conditions not met"}</p></div>
                  <div className="h-10 w-px bg-border" />
                  <div><p className="text-sm text-muted-foreground">Conditions</p><p className="text-lg font-semibold text-foreground">{selectedGate.conditions.filter(c => c.status === "passed").length}/{selectedGate.conditions.length} passed</p></div>
                  <div className="h-10 w-px bg-border" />
                  <div><p className="text-sm text-muted-foreground">Last Evaluated</p><p className="text-lg font-semibold text-foreground">{selectedGate.lastEvaluated}</p></div>
                </div>

                {selectedGate.conditions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pass Rate</span><span className="font-medium text-foreground">{Math.round((selectedGate.conditions.filter(c => c.status === "passed").length / selectedGate.conditions.length) * 100)}%</span></div>
                    <Progress value={(selectedGate.conditions.filter(c => c.status === "passed").length / selectedGate.conditions.length) * 100} className="h-2" />
                  </div>
                )}

                {/* Conditions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Conditions</h4>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setConditionOpen(true)}><Plus className="h-4 w-4" />Add Condition</Button>
                  </div>
                  <Card className="border-border">
                    <CardContent className="p-4">
                      {selectedGate.conditions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">No conditions yet. Add one to start evaluating code quality.</p>
                      ) : selectedGate.conditions.map(c => (
                        <ConditionRow key={c.id} condition={c} gateId={selectedGate.id} onRemove={() => removeCondition(selectedGate.id, c.id)} />
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-1"><p className="font-medium text-foreground">Block deployment on failure</p><p className="text-sm text-muted-foreground">Prevent code from being deployed if quality gate fails</p></div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card"><CardContent className="p-12 text-center text-muted-foreground">Create a quality gate to get started.</CardContent></Card>
          )}
        </div>
      </div>

      {/* Create Gate Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Quality Gate</DialogTitle><DialogDescription>Define a new quality gate with custom conditions.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input placeholder="e.g., Strict Security" value={newGate.name} onChange={e => setNewGate({ ...newGate, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Input placeholder="What this gate enforces..." value={newGate.description} onChange={e => setNewGate({ ...newGate, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGate} disabled={!newGate.name}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Condition Dialog */}
      <Dialog open={conditionOpen} onOpenChange={setConditionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Condition</DialogTitle><DialogDescription>Add a metric condition to "{selectedGate?.name}".</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Metric</Label>
              <Select value={newCondition.metric} onValueChange={v => setNewCondition({ ...newCondition, metric: v })}>
                <SelectTrigger><SelectValue placeholder="Select metric" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coverage">Coverage</SelectItem>
                  <SelectItem value="Duplicated Lines">Duplicated Lines</SelectItem>
                  <SelectItem value="Security Rating">Security Rating</SelectItem>
                  <SelectItem value="Reliability Rating">Reliability Rating</SelectItem>
                  <SelectItem value="Maintainability Rating">Maintainability Rating</SelectItem>
                  <SelectItem value="Vulnerabilities">Vulnerabilities</SelectItem>
                  <SelectItem value="Bugs">Bugs</SelectItem>
                  <SelectItem value="Code Smells">Code Smells</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select value={newCondition.operator} onValueChange={v => setNewCondition({ ...newCondition, operator: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<">{"< (less than)"}</SelectItem>
                    <SelectItem value=">">{">"} (greater than)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Threshold</Label><Input type="number" value={newCondition.threshold} onChange={e => setNewCondition({ ...newCondition, threshold: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={newCondition.unit} onValueChange={v => setNewCondition({ ...newCondition, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="Rating">Rating</SelectItem>
                    <SelectItem value=" issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConditionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCondition} disabled={!newCondition.metric}>Add Condition</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
